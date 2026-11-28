import type { AppNotification, RideRequest, Trip } from '../types';
import { api } from './api';

export type TripSearch = {
  origin: string;
  destination: string;
  date: Date | null;
  passengers: number;
  womenOnly: boolean;
};

type TripInput = Pick<Trip, 'origem' | 'destino' | 'departureAt' | 'assentos' | 'ajudaCusto' | 'apenasMulheres' | 'manualApproval'>
  & Partial<Pick<Trip, 'origemLat' | 'origemLng' | 'destinoLat' | 'destinoLng' | 'notes'>>;

export function searchTrips(token: string, filters: TripSearch) {
  const params = new URLSearchParams();
  if (filters.origin.trim()) params.set('origem', filters.origin.trim());
  if (filters.destination.trim()) params.set('destino', filters.destination.trim());
  if (filters.date) {
    const { date } = filters;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    params.set('date', `${date.getFullYear()}-${month}-${day}`);
  }
  params.set('passengers', String(filters.passengers));
  if (filters.womenOnly) params.set('apenasMulheres', 'true');
  return api<Trip[]>(`/trips?${params}`, token);
}

export function getDriverTrips(token: string, signal?: AbortSignal) {
  return api<Trip[]>('/trips/mine', token, { signal });
}

export function getPassengerRequests(token: string, signal?: AbortSignal) {
  return api<RideRequest[]>('/requests/mine', token, { signal });
}

export function publishTrip(token: string, data: TripInput) {
  return api('/trips', token, { method: 'POST', body: JSON.stringify(data) });
}

export function requestSeats(token: string, tripId: string, seats: number) {
  return api<RideRequest>(`/trips/${tripId}/requests`, token, { method: 'POST', body: JSON.stringify({ seats }) });
}

export function updateRequest(token: string, requestId: string, action: 'accept' | 'refuse' | 'cancel') {
  return api<RideRequest>(`/requests/${requestId}/${action}`, token, { method: 'POST' });
}

export function updateTrip(token: string, tripId: string, action: 'start' | 'finish' | 'cancel') {
  return api(`/trips/${tripId}/${action}`, token, { method: 'POST' });
}

export function rateParticipant(token: string, tripId: string, subjectId: string, stars: number) {
  return api(`/trips/${tripId}/ratings`, token, { method: 'POST', body: JSON.stringify({ subjectId, stars }) });
}

export function getNotifications(token: string) {
  return api<AppNotification[]>('/notifications', token);
}

export function markNotificationsRead(token: string) {
  return api('/notifications/read', token, { method: 'POST' });
}

export function getNotificationCount(token: string, signal?: AbortSignal) {
  return api<{ count: number }>('/notifications/count', token, { signal });
}
