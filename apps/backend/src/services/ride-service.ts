import {
  ratingSchema,
  rideRequestSchema,
  tripSchema,
  tripSearchSchema,
  vehicleSchema,
  type RatingInput,
  type RideRequestInput,
  type TripInput,
  type TripSearchInput,
  type VehicleInput,
} from '@viajunto/shared-types';

import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../errors/app-error.js';
import type { Trip, TripStatus } from '../models/rides.js';
import type { PublicUser } from '../models/user.js';
import type { RideRepository } from '../repositories/ride-repository.js';
import { UniqueConstraintError } from '../repositories/repository-errors.js';

function isWomenOnlyRestricted(user: PublicUser): boolean {
  return user.role === 'passageiro' && user.genero !== 'F';
}

function requireTripVisibility(user: PublicUser, trip: Pick<Trip, 'apenasMulheres'>): void {
  if (trip.apenasMulheres && isWomenOnlyRestricted(user)) {
    throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
  }
}

export class RideService {
  constructor(private readonly repository: RideRepository) {}

  async createVehicle(userId: string, input: VehicleInput) {
    const parsed = vehicleSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.repository.findUserById(userId);
    if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Usuário não encontrado');
    if (user.role !== 'motorista') throw new ForbiddenError('DRIVER_REQUIRED', 'Somente motoristas podem cadastrar veículos');
    if (await this.repository.findVehicleByDriverId(userId)) throw new ConflictError('VEHICLE_ALREADY_EXISTS', 'Você já cadastrou um veículo');
    if (await this.repository.findVehicleByPlate(parsed.data.placa)) throw new ConflictError('PLATE_ALREADY_EXISTS', 'Esta placa já está cadastrada');
    return this.repository.createVehicle({ ...parsed.data, driverId: userId });
  }

  async getMyVehicle(userId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const vehicle = await this.repository.findVehicleByDriverId(userId);
    if (!vehicle) throw new NotFoundError('VEHICLE_NOT_FOUND', 'Veículo não cadastrado');
    return vehicle;
  }

  async updateVehicle(userId: string, input: VehicleInput) {
    const parsed = vehicleSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const current = await this.repository.findVehicleByDriverId(userId);
    if (!current) throw new NotFoundError('VEHICLE_NOT_FOUND', 'Cadastre um veículo antes');
    if (parsed.data.placa !== current.placa && await this.repository.findVehicleByPlate(parsed.data.placa)) {
      throw new ConflictError('PLATE_ALREADY_EXISTS', 'Esta placa já está cadastrada');
    }
    return this.repository.updateVehicle(userId, parsed.data);
  }

  async createTrip(userId: string, input: TripInput) {
    const parsed = tripSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    if (parsed.data.apenasMulheres && user.genero !== 'F') {
      throw new ForbiddenError('WOMEN_ONLY_DRIVER_REQUIRED', 'Somente motoristas mulheres podem criar viagens só para mulheres');
    }
    if (new Date(parsed.data.departureAt).getTime() <= Date.now()) {
      throw new ValidationError('A data de partida deve ser futura');
    }
    const vehicle = await this.repository.findVehicleByDriverId(userId);
    if (!vehicle) throw new NotFoundError('VEHICLE_REQUIRED', 'Cadastre um veículo antes de publicar uma viagem');
    if (parsed.data.assentos > vehicle.lugares) {
      throw new ValidationError(`O veículo possui apenas ${vehicle.lugares} lugares`);
    }
    return this.repository.createTrip({
      ...parsed.data,
      departureAt: new Date(parsed.data.departureAt),
      driverId: userId,
    });
  }

  async searchTrips(userId: string, input: TripSearchInput) {
    const parsed = tripSearchSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'passageiro');
    return this.repository.searchTrips({
      origem: parsed.data.origem,
      destino: parsed.data.destino,
      apenasMulheres: isWomenOnlyRestricted(user) ? false : parsed.data.apenasMulheres === 'true' ? true : undefined,
      date: parsed.data.date ? new Date(`${parsed.data.date}T00:00:00`) : undefined,
      passengers: parsed.data.passengers,
    });
  }

  async getTrip(userId: string, id: string) {
    const user = await this.requireUser(userId);
    const trip = await this.repository.findTripById(id);
    if (!trip) throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
    requireTripVisibility(user, trip);
    if (user.role === 'motorista' && trip.driverId !== userId) {
      throw new ForbiddenError('OWN_TRIP_ONLY', 'Motoristas só podem visualizar suas próprias viagens');
    }
    if (user.role === 'passageiro' && trip.driverId === userId) {
      throw new ForbiddenError('OWN_TRIP_NOT_ALLOWED', 'Você não pode solicitar sua própria viagem');
    }
    return trip;
  }

  async getMyTrips(userId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    return this.repository.findTripsByDriverId(userId);
  }

  async getPassengerTrips(userId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'passageiro');
    return this.repository.findTripsByPassengerId(userId, !isWomenOnlyRestricted(user));
  }

  async createRequest(userId: string, tripId: string, input: RideRequestInput) {
    const parsed = rideRequestSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'passageiro');
    const trip = await this.repository.findTripById(tripId);
    if (!trip) throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
    requireTripVisibility(user, trip);
    if (trip.driverId === userId) throw new ForbiddenError('OWN_TRIP_NOT_ALLOWED', 'Você não pode solicitar sua própria viagem');
    if (trip.status === 'cancelled' || trip.status === 'finished' || trip.departureAt.getTime() <= Date.now()) {
      throw new ConflictError('TRIP_NOT_AVAILABLE', 'Esta viagem não está mais disponível');
    }
    if (trip.status === 'full' || trip.seatsAvailable < parsed.data.seats) {
      throw new ConflictError('NOT_ENOUGH_SEATS', 'Não há lugares suficientes nesta viagem');
    }
    if (await this.repository.findRequest(tripId, userId)) {
      throw new ConflictError('REQUEST_ALREADY_EXISTS', 'Você já enviou um pedido para esta viagem');
    }
    const status = trip.manualApproval ? 'pending' : 'accepted';
    let result: Awaited<ReturnType<RideRepository['createRequest']>>;
    try {
      result = await this.repository.createRequest(tripId, userId, parsed.data.seats, status);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError('REQUEST_ALREADY_EXISTS', 'Você já enviou um pedido para esta viagem');
      }
      throw error;
    }
    if (result.error === 'no_seats') throw new ConflictError('NOT_ENOUGH_SEATS', 'Não há lugares suficientes nesta viagem');
    return result.request;
  }

  async getTripRequests(userId: string, tripId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const trip = await this.repository.findTripById(tripId);
    if (!trip) throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
    if (trip.driverId !== userId) throw new ForbiddenError('OWN_TRIP_ONLY', 'Você não pode ver pedidos desta viagem');
    return this.repository.findRequestsByTrip(tripId);
  }

  async acceptRequest(userId: string, requestId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const request = await this.repository.findRequestById(requestId);
    if (!request) throw new NotFoundError('REQUEST_NOT_FOUND', 'Pedido não encontrado');
    if (!request.trip || request.trip.driverId !== userId) throw new ForbiddenError('OWN_TRIP_ONLY', 'Você não pode aceitar este pedido');
    if (request.trip.status !== 'open' || request.trip.departureAt.getTime() <= Date.now()) {
      throw new ConflictError('TRIP_NOT_AVAILABLE', 'Esta viagem não está mais disponível para aceitar pedidos');
    }
    const result = await this.repository.acceptRequest(requestId, userId);
    if (result.error === 'not_owner') throw new ForbiddenError('OWN_TRIP_ONLY', 'Você não pode aceitar este pedido');
    if (result.error === 'not_pending') throw new ConflictError('REQUEST_NOT_PENDING', 'Este pedido não está pendente');
    if (result.error === 'no_seats') throw new ConflictError('NOT_ENOUGH_SEATS', 'Não há lugares suficientes para aceitar este pedido');
    return result.request;
  }

  async refuseRequest(userId: string, requestId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const request = await this.repository.findRequestById(requestId);
    if (!request) throw new NotFoundError('REQUEST_NOT_FOUND', 'Pedido não encontrado');
    if (request.trip?.driverId !== userId) throw new ForbiddenError('OWN_TRIP_ONLY', 'Você não pode recusar este pedido');
    const result = await this.repository.transitionRequest(requestId, 'refused');
    if (result.error) throw new ConflictError('REQUEST_NOT_PENDING', 'Este pedido não pode mais ser recusado');
    return result.request;
  }

  async cancelRequest(userId: string, requestId: string) {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'passageiro');
    const request = await this.repository.findRequestById(requestId);
    if (!request) throw new NotFoundError('REQUEST_NOT_FOUND', 'Pedido não encontrado');
    if (request.passengerId !== userId) throw new ForbiddenError('OWN_REQUEST_ONLY', 'Você não pode cancelar este pedido');
    if (request.trip) requireTripVisibility(user, request.trip);
    if (request.trip?.status === 'in_progress' || request.trip?.status === 'finished' || request.trip?.status === 'cancelled') {
      throw new ConflictError('REQUEST_NOT_ACTIVE', 'Este pedido não pode mais ser cancelado');
    }
    const result = await this.repository.transitionRequest(requestId, 'cancelled');
    if (result.error) throw new ConflictError('REQUEST_NOT_ACTIVE', 'Este pedido não pode mais ser cancelado');
    return result.request;
  }

  async changeTripStatus(userId: string, tripId: string, action: 'start' | 'finish' | 'cancel') {
    const user = await this.requireUser(userId);
    this.requireRole(user.role, 'motorista');
    const trip = await this.repository.findTripById(tripId);
    if (!trip) throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
    if (trip.driverId !== userId) throw new ForbiddenError('OWN_TRIP_ONLY', 'Você não pode alterar esta viagem');

    const allowed: Record<typeof action, TripStatus[]> = {
      start: ['open', 'full'],
      finish: ['in_progress'],
      cancel: ['open', 'full'],
    };
    if (!allowed[action].includes(trip.status)) {
      throw new ConflictError('INVALID_TRIP_STATE', 'Esta ação não é permitida no estado atual da viagem');
    }
    const status = action === 'start' ? 'in_progress' : action === 'finish' ? 'finished' : 'cancelled';
    const changed = await this.repository.setTripStatus(tripId, userId, status, allowed[action]);
    if (!changed) throw new ConflictError('INVALID_TRIP_STATE', 'A viagem foi atualizada por outra ação');
    return changed;
  }

  async createRating(userId: string, tripId: string, input: RatingInput) {
    const parsed = ratingSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError();
    const user = await this.requireUser(userId);
    const trip = await this.repository.findTripById(tripId);
    if (!trip) throw new NotFoundError('TRIP_NOT_FOUND', 'Viagem não encontrada');
    requireTripVisibility(user, trip);
    if (trip.status !== 'finished') throw new ConflictError('TRIP_NOT_FINISHED', 'A avaliação fica disponível após a viagem');
    const acceptedRequests = await this.repository.findRequestsByTrip(tripId);
    let subjectId: string;
    if (user.role === 'motorista' && trip.driverId === userId) {
      const request = acceptedRequests.find((item) => item.passengerId === parsed.data.subjectId && item.status === 'accepted');
      if (!request) throw new ForbiddenError('RATING_NOT_ALLOWED', 'Só é possível avaliar passageiros confirmados');
      subjectId = request.passengerId;
    } else if (user.role === 'passageiro') {
      const request = acceptedRequests.find((item) => item.passengerId === userId && item.status === 'accepted');
      if (!request || parsed.data.subjectId !== trip.driverId) {
        throw new ForbiddenError('RATING_NOT_ALLOWED', 'Você precisa ter participado desta viagem para avaliar');
      }
      subjectId = trip.driverId;
    } else {
      throw new ForbiddenError('RATING_NOT_ALLOWED', 'Você não participou desta viagem');
    }
    if (await this.repository.findRating(tripId, userId, subjectId)) {
      throw new ConflictError('RATING_ALREADY_EXISTS', 'Você já avaliou esta pessoa nesta viagem');
    }
    try {
      return await this.repository.createRating({
        tripId,
        authorId: userId,
        subjectId,
        stars: parsed.data.stars,
        comment: parsed.data.comment ?? null,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError('RATING_ALREADY_EXISTS', 'Você já avaliou esta pessoa nesta viagem');
      }
      throw error;
    }
  }

  async listNotifications(userId: string) {
    const user = await this.requireUser(userId);
    return this.repository.listNotifications(userId, !isWomenOnlyRestricted(user));
  }

  async getNotificationCount(userId: string) {
    const user = await this.requireUser(userId);
    return this.repository.countUnreadNotifications(userId, !isWomenOnlyRestricted(user));
  }

  async markNotificationsRead(userId: string) {
    await this.requireUser(userId);
    await this.repository.markNotificationsRead(userId);
    return { success: true };
  }

  private async requireUser(userId: string) {
    const user = await this.repository.findUserById(userId);
    if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Usuário não encontrado');
    return user;
  }

  private requireRole(role: string, expected: 'motorista' | 'passageiro') {
    if (role !== expected) {
      throw new ForbiddenError(expected === 'motorista' ? 'DRIVER_REQUIRED' : 'PASSENGER_REQUIRED', 'Ação não permitida para este perfil');
    }
  }
}
