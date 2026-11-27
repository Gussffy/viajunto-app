import type { Notification, Rating, RideRequest, Trip, TripStatus, Vehicle } from '../models/rides.js';
import type { PublicUser } from '../models/user.js';

export interface CreateVehicleData {
  placa: string;
  modelo: string;
  cor: string;
  lugares: number;
  driverId: string;
}

export interface CreateTripData {
  origem: string;
  origemLat?: number;
  origemLng?: number;
  destino: string;
  destinoLat?: number;
  destinoLng?: number;
  departureAt: Date;
  assentos: number;
  ajudaCusto: number;
  apenasMulheres: boolean;
  manualApproval: boolean;
  notes?: string;
  driverId: string;
}

export interface TripFilters {
  origem?: string;
  destino?: string;
  apenasMulheres?: boolean;
  date?: Date;
  passengers?: number;
}

export interface RideRepository {
  findUserById(id: string): Promise<PublicUser | null>;
  findVehicleByDriverId(driverId: string): Promise<Vehicle | null>;
  findVehicleByPlate(placa: string): Promise<Vehicle | null>;
  createVehicle(data: CreateVehicleData): Promise<Vehicle>;
  updateVehicle(driverId: string, data: Omit<CreateVehicleData, 'driverId'>): Promise<Vehicle>;
  createTrip(data: CreateTripData): Promise<Trip>;
  searchTrips(filters: TripFilters): Promise<Trip[]>;
  findTripById(id: string): Promise<Trip | null>;
  findTripsByDriverId(driverId: string): Promise<Trip[]>;
  findTripsByPassengerId(passengerId: string, includeWomenOnly: boolean): Promise<RideRequest[]>;
  findRequest(tripId: string, passengerId: string): Promise<RideRequest | null>;
  findRequestById(id: string): Promise<RideRequest | null>;
  createRequest(tripId: string, passengerId: string, seats: number, status: 'pending' | 'accepted'): Promise<{ request?: RideRequest; error?: 'no_seats' }>;
  findRequestsByTrip(tripId: string): Promise<RideRequest[]>;
  acceptRequest(requestId: string, driverId: string): Promise<{ request?: RideRequest; error?: 'not_pending' | 'no_seats' | 'not_owner' }>;
  transitionRequest(requestId: string, status: 'refused' | 'cancelled'): Promise<{ request?: RideRequest; error?: 'not_found' | 'invalid_state' }>;
  setTripStatus(tripId: string, driverId: string, status: TripStatus, expectedStatuses: TripStatus[]): Promise<Trip | null>;
  cancelTripRequests(tripId: string): Promise<void>;
  listNotifications(userId: string, includeWomenOnly: boolean): Promise<Notification[]>;
  countUnreadNotifications(userId: string, includeWomenOnly: boolean): Promise<number>;
  markNotificationsRead(userId: string): Promise<void>;
  createRating(data: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating>;
  findRating(tripId: string, authorId: string, subjectId: string): Promise<Rating | null>;
  getDriverRating(driverId: string): Promise<{ average: number; count: number }>;
}
