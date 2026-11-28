import type { User } from './account';

export type Trip = {
  id: string;
  origem: string;
  destino: string;
  origemLat?: number | null;
  origemLng?: number | null;
  destinoLat?: number | null;
  destinoLng?: number | null;
  departureAt: string;
  assentos: number;
  ajudaCusto: number;
  apenasMulheres: boolean;
  manualApproval: boolean;
  notes?: string | null;
  seatsTotal: number;
  seatsAvailable: number;
  status: 'open' | 'full' | 'in_progress' | 'finished' | 'cancelled';
  driverId: string;
  driver?: { id: string; nome: string; genero?: User['genero']; ratingAverage?: number | null; ratingCount?: number };
  vehicle?: { modelo: string; cor: string; placa?: string; lugares?: number } | null;
  requests?: RideRequest[];
};

export type RideRequest = {
  id: string;
  tripId: string;
  passengerId: string;
  seats: number;
  status: 'pending' | 'accepted' | 'refused' | 'cancelled';
  createdAt: string;
  passenger?: { id: string; nome: string; ratingAverage?: number | null; ratingCount?: number };
  trip?: Trip;
};

export type AppNotification = {
  id: string;
  type: string;
  tripId: string;
  read: boolean;
  createdAt: string;
  trip?: { origem: string; destino: string; departureAt: string };
};
