import { useEffect, useState } from 'react';
import { BackHandler, Keyboard } from 'react-native';
import { UNEX } from '../../../data/mock-places';
import { getPassengerRequests, searchTrips, type TripSearch } from '../../services/ride-api';
import type { RideRequest, Trip, User } from '../../types';

export type RideSearchOptions = {
  token: string;
  user: User;
  active: boolean;
  suggestedDestination: string | null;
  onUseSuggestedDestination: () => void;
};

export function useRideSearch({ token, user, active, suggestedDestination, onUseSuggestedDestination }: RideSearchOptions) {
  const [filters, setFilters] = useState<TripSearch>({
    origin: UNEX.city, destination: '', date: null, passengers: 1, womenOnly: false,
  });
  const [submitted, setSubmitted] = useState<TripSearch | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Trip | null>(null);
  const [requestBusy, setRequestBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const canSeeExclusiveTrips = user.role === 'passageiro' && user.genero === 'F';

  useEffect(() => {
    if (!active || !suggestedDestination) return;
    setFilters((current) => ({ ...current, origin: UNEX.city, destination: suggestedDestination }));
    setSubmitted(null);
    onUseSuggestedDestination();
  }, [active, suggestedDestination, onUseSuggestedDestination]);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    void getPassengerRequests(token, controller.signal).then((result) => {
      if (!controller.signal.aborted) setRequests(result);
    }).catch(() => undefined);
    return () => controller.abort();
  }, [active, token]);

  useEffect(() => {
    if (!active || !submitted) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setSubmitted(null);
      return true;
    });
    return () => subscription.remove();
  }, [active, submitted]);

  const findRides = async (values: TripSearch) => {
    if (loading) return;
    Keyboard.dismiss();
    setFilters(values);
    setSubmitted(values);
    setLoading(true);
    setError(null);
    setTrips([]);
    try {
      const results = await searchTrips(token, { ...values, womenOnly: canSeeExclusiveTrips && values.womenOnly });
      setTrips(canSeeExclusiveTrips ? results : results.filter((trip) => !trip.apenasMulheres));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const currentRequest = selected ? requests.find((request) => request.tripId === selected.id) : undefined;
  const updateRequest = async (perform: () => Promise<RideRequest>) => {
    if (requestBusy) return;
    setRequestBusy(true);
    setRequestError(null);
    try {
      const request = await perform();
      setRequests((current) => [...current.filter((item) => item.id !== request.id), request]);
      if (request.status === 'accepted' || (request.status === 'cancelled' && currentRequest?.status === 'accepted')) {
        const difference = request.status === 'accepted' ? -request.seats : request.seats;
        const adjustTrip = (trip: Trip) => trip.id === request.tripId
          ? { ...trip, seatsAvailable: Math.max(0, Math.min(trip.seatsTotal, trip.seatsAvailable + difference)) }
          : trip;
        setTrips((current) => current.map(adjustTrip));
        setSelected((current) => current ? adjustTrip(current) : null);
      }
    } catch (reason) {
      setRequestError(reason instanceof Error ? reason.message : 'Tente novamente.');
    } finally {
      setRequestBusy(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setRequestError(null);
  };
  return {
    filters, setFilters, submitted, clearResults: () => setSubmitted(null), trips, loading, error,
    selected, setSelected, currentRequest, requestBusy, requestError, updateRequest, closeDetail,
    locationSheetVisible, setLocationSheetVisible, datePickerVisible, setDatePickerVisible,
    canSeeExclusiveTrips, findRides,
  };
}
