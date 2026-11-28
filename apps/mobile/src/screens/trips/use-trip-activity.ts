import { useCallback, useEffect, useRef, useState } from 'react';
import { getDriverTrips, getNotifications, getPassengerRequests, markNotificationsRead } from '../../services/ride-api';
import type { AppNotification, RideRequest, Trip, User } from '../../types';

type TripFilter = 'upcoming' | 'finished' | 'cancelled';
type Panel = 'trips' | 'detail' | 'notifications';

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : 'Tente novamente.';
}

export function useTripActivity(token: string, user: User, onActivityChanged: () => void) {
  const driver = user.role === 'motorista';
  const [trips, setTrips] = useState<Trip[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [filter, setFilter] = useState<TripFilter>('upcoming');
  const [panel, setPanel] = useState<Panel>('trips');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const refreshController = useRef<AbortController | null>(null);

  const refresh = useCallback(async (mode: 'initial' | 'manual' | 'poll') => {
    if (mode === 'poll' && refreshController.current) return;
    refreshController.current?.abort();
    const controller = new AbortController();
    refreshController.current = controller;
    if (mode === 'manual') setRefreshing(true);
    try {
      if (driver) {
        const result = await getDriverTrips(token, controller.signal);
        if (!controller.signal.aborted) setTrips(result);
      } else {
        const result = await getPassengerRequests(token, controller.signal);
        if (!controller.signal.aborted) setRequests(result);
      }
      if (controller.signal.aborted) return;
      setError(null);
    } catch (reason) {
      if (!controller.signal.aborted && mode !== 'poll') setError(errorMessage(reason));
    } finally {
      if (!controller.signal.aborted) {
        refreshController.current = null;
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [driver, token]);

  useEffect(() => {
    void refresh('initial');
    const timer = setInterval(() => { void refresh('poll'); }, 30000);
    return () => { clearInterval(timer); refreshController.current?.abort(); };
  }, [refresh]);

  const loadNotifications = async () => {
    if (notificationLoading) return;
    setPanel('notifications');
    setNotificationLoading(true);
    setNotificationError(null);
    try {
      setNotifications(await getNotifications(token));
      await markNotificationsRead(token);
      onActivityChanged();
    } catch (reason) {
      setNotificationError(errorMessage(reason));
    } finally {
      setNotificationLoading(false);
    }
  };

  const update = async (perform: () => Promise<unknown>) => {
    if (actionBusy) return false;
    setActionBusy(true);
    setActionError(null);
    try {
      await perform();
      await refresh('manual');
      onActivityChanged();
      return true;
    } catch (reason) {
      setActionError(errorMessage(reason));
      return false;
    } finally {
      setActionBusy(false);
    }
  };

  const selectedRequest = driver ? undefined : requests.find((request) => request.id === selection);
  const selectedTrip = driver ? trips.find((trip) => trip.id === selection) : selectedRequest?.trip;
  const visibleTrips = trips.filter((trip) => filter === 'upcoming'
    ? trip.status !== 'finished' && trip.status !== 'cancelled'
    : trip.status === filter);
  const showDetails = (id: string) => {
    setActionError(null);
    setSelection(id);
    setPanel('detail');
  };
  const closePanel = () => {
    setSelection(null);
    setPanel('trips');
  };

  return {
    driver, filter, setFilter, visibleTrips, requests, notifications, notificationLoading, notificationError,
    selectedRequest, selectedTrip, panel, loading, refreshing, error, actionBusy, actionError,
    refresh, loadNotifications, update, showDetails, closePanel,
  };
}
