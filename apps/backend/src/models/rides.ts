import type { Gender } from '@viajunto/shared-types';

export type TripStatus = 'open' | 'full' | 'in_progress' | 'finished' | 'cancelled';
export type RideRequestStatus = 'pending' | 'accepted' | 'refused' | 'cancelled';
export type NotificationType =
  | 'new_request'
  | 'request_accepted'
  | 'request_refused'
  | 'request_cancelled'
  | 'trip_cancelled'
  | 'trip_started'
  | 'trip_finished'
  | 'new_rating';

export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  lugares: number;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RideRequest {
  id: string;
  tripId: string;
  passengerId: string;
  seats: number;
  status: RideRequestStatus;
  createdAt: Date;
  passenger?: { id: string; nome: string; ratingAverage?: number | null; ratingCount?: number };
  trip?: Trip;
}

export interface Trip {
  id: string;
  origem: string;
  origemLat: number | null;
  origemLng: number | null;
  destino: string;
  destinoLat: number | null;
  destinoLng: number | null;
  departureAt: Date;
  assentos: number;
  seatsTotal: number;
  seatsAvailable: number;
  ajudaCusto: number;
  apenasMulheres: boolean;
  manualApproval: boolean;
  notes: string | null;
  status: TripStatus;
  driverId: string;
  driver?: { id: string; nome: string; genero: Gender; ratingAverage?: number | null; ratingCount?: number };
  vehicle?: { modelo: string; cor: string; placa?: string; lugares?: number } | null;
  requests?: RideRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  tripId: string;
  read: boolean;
  createdAt: Date;
  trip?: Pick<Trip, 'origem' | 'destino' | 'departureAt'>;
}

export interface Rating {
  id: string;
  tripId: string;
  authorId: string;
  subjectId: string;
  stars: number;
  comment: string | null;
  createdAt: Date;
}
