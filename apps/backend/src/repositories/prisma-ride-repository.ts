import { Prisma, type PrismaClient } from '@prisma/client';

import type { Notification, Rating, RideRequest, Trip, TripStatus, Vehicle } from '../models/rides.js';
import type { PublicUser } from '../models/user.js';
import type { CreateTripData, CreateVehicleData, RideRepository, TripFilters } from './ride-repository.js';
import { mapRequest, mapTrip, tripInclude } from './prisma-ride-mappers.js';
import { UniqueConstraintError } from './repository-errors.js';

class InsufficientSeatsError extends Error {}

function rethrowWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new UniqueConstraintError(error);
  }
  throw error;
}

export class PrismaRideRepository implements RideRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, genero: true, role: true, createdAt: true },
    });
  }

  async findVehicleByDriverId(driverId: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { driverId } });
  }

  async findVehicleByPlate(placa: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { placa } });
  }

  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async updateVehicle(driverId: string, data: Omit<CreateVehicleData, 'driverId'>): Promise<Vehicle> {
    return this.prisma.vehicle.update({ where: { driverId }, data });
  }

  async createTrip(data: CreateTripData): Promise<Trip> {
    return this.prisma.trip.create({
      data: {
        ...data,
        seatsTotal: data.assentos,
        seatsAvailable: data.assentos,
        status: 'open',
      },
    });
  }

  async searchTrips(filters: TripFilters): Promise<Trip[]> {
    const dayStart = filters.date ? new Date(filters.date) : undefined;
    const dayEnd = dayStart ? new Date(dayStart.getTime() + 24 * 60 * 60 * 1000) : undefined;
    const trips = await this.prisma.trip.findMany({
      where: {
        status: { in: ['open', 'full'] },
        seatsAvailable: { gte: filters.passengers ?? 1 },
        departureAt: {
          gte: dayStart ?? new Date(),
          ...(dayEnd ? { lt: dayEnd } : {}),
        },
        ...(filters.origem ? { origem: { contains: filters.origem, mode: 'insensitive' } } : {}),
        ...(filters.destino ? { destino: { contains: filters.destino, mode: 'insensitive' } } : {}),
        ...(filters.apenasMulheres !== undefined ? { apenasMulheres: filters.apenasMulheres } : {}),
      },
      include: tripInclude,
      orderBy: { departureAt: 'asc' },
    });
    return trips.map(mapTrip);
  }

  async findTripById(id: string): Promise<Trip | null> {
    const trip = await this.prisma.trip.findUnique({ where: { id }, include: tripInclude });
    if (!trip) return null;
    return mapTrip(trip);
  }

  async findTripsByDriverId(driverId: string): Promise<Trip[]> {
    const trips = await this.prisma.trip.findMany({
      where: { driverId },
      include: tripInclude,
      orderBy: { departureAt: 'asc' },
    });
    return trips.map(mapTrip);
  }

  async findTripsByPassengerId(passengerId: string, includeWomenOnly: boolean): Promise<RideRequest[]> {
    return this.prisma.rideRequest.findMany({
      where: { passengerId, ...(includeWomenOnly ? {} : { trip: { apenasMulheres: false } }) },
      include: {
        passenger: { select: { id: true, nome: true, ratingsReceived: { select: { stars: true } } } },
        trip: { include: tripInclude },
      },
      orderBy: { createdAt: 'desc' },
    }).then((requests) => requests.map(mapRequest));
  }

  async findRequest(tripId: string, passengerId: string): Promise<RideRequest | null> {
    return this.prisma.rideRequest.findUnique({ where: { tripId_passengerId: { tripId, passengerId } } });
  }

  async findRequestById(id: string): Promise<RideRequest | null> {
    return this.prisma.rideRequest.findUnique({
      where: { id },
      include: {
        passenger: { select: { id: true, nome: true, ratingsReceived: { select: { stars: true } } } },
        trip: { include: tripInclude },
      },
    }).then((request) => request ? mapRequest(request) : null);
  }

  async createRequest(tripId: string, passengerId: string, seats: number, status: 'pending' | 'accepted'): Promise<{ request?: RideRequest; error?: 'no_seats' }> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const trip = await transaction.trip.findUniqueOrThrow({ where: { id: tripId } });
        if (status === 'accepted') {
          const reserved = await transaction.trip.updateMany({
            where: { id: tripId, status: 'open', seatsAvailable: { gte: seats } },
            data: { seatsAvailable: { decrement: seats }, assentos: { decrement: seats } },
          });
          if (reserved.count !== 1) return { error: 'no_seats' as const };
          const currentTrip = await transaction.trip.findUniqueOrThrow({ where: { id: tripId } });
          if (currentTrip.seatsAvailable === 0) {
            await transaction.trip.update({ where: { id: tripId }, data: { status: 'full' } });
          }
        }
        const request = await transaction.rideRequest.create({
          data: { tripId, passengerId, seats, status },
          include: { passenger: { select: { id: true, nome: true } } },
        });
        if (status === 'accepted') {
          await transaction.notification.create({
            data: { userId: passengerId, tripId, type: 'request_accepted' },
          });
        } else {
          await transaction.notification.create({
            data: { userId: trip.driverId, tripId, type: 'new_request' },
          });
        }
        return { request };
      });
    } catch (error) {
      rethrowWriteError(error);
    }
  }


  async findRequestsByTrip(tripId: string): Promise<RideRequest[]> {
    return this.prisma.rideRequest.findMany({
      where: { tripId },
      include: { passenger: { select: { id: true, nome: true, ratingsReceived: { select: { stars: true } } } } },
      orderBy: { createdAt: 'asc' },
    }).then((requests) => requests.map((request) => {
      const { ratingsReceived, ...passenger } = request.passenger;
      return {
        ...request,
        passenger: {
          ...passenger,
          ratingAverage: ratingsReceived.length
            ? ratingsReceived.reduce((total, rating) => total + rating.stars, 0) / ratingsReceived.length
            : null,
          ratingCount: ratingsReceived.length,
        },
      };
    }));
  }

  async acceptRequest(requestId: string, driverId: string): Promise<{ request?: RideRequest; error?: 'not_pending' | 'no_seats' | 'not_owner' }> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const request = await transaction.rideRequest.findUnique({
          where: { id: requestId },
          include: { trip: true, passenger: { select: { id: true, nome: true } } },
        });
        if (!request || request.trip.driverId !== driverId) return { error: 'not_owner' as const };
        if (request.status !== 'pending') return { error: 'not_pending' as const };

        const changed = await transaction.rideRequest.updateMany({
          where: { id: request.id, status: 'pending' },
          data: { status: 'accepted' },
        });
        if (changed.count !== 1) return { error: 'not_pending' as const };
        const reserved = await transaction.trip.updateMany({
          where: { id: request.tripId, status: 'open', seatsAvailable: { gte: request.seats } },
          data: { seatsAvailable: { decrement: request.seats }, assentos: { decrement: request.seats } },
        });
        if (reserved.count !== 1) throw new InsufficientSeatsError();

        const updatedTrip = await transaction.trip.findUniqueOrThrow({ where: { id: request.tripId } });
        if (updatedTrip.seatsAvailable === 0) {
          await transaction.trip.update({ where: { id: request.tripId }, data: { status: 'full' } });
        }
        await transaction.notification.create({
          data: { userId: request.passengerId, tripId: request.tripId, type: 'request_accepted' },
        });
        const accepted = await transaction.rideRequest.findUniqueOrThrow({
          where: { id: request.id },
          include: { passenger: { select: { id: true, nome: true } } },
        });
        return { request: accepted };
      });
    } catch (error) {
      if (error instanceof InsufficientSeatsError) return { error: 'no_seats' };
      throw error;
    }
  }

  async transitionRequest(requestId: string, status: 'refused' | 'cancelled'): Promise<{ request?: RideRequest; error?: 'not_found' | 'invalid_state' }> {
    return this.prisma.$transaction(async (transaction) => {
      const request = await transaction.rideRequest.findUnique({
        where: { id: requestId },
        include: { trip: true, passenger: { select: { id: true, nome: true } } },
      });
      if (!request) return { error: 'not_found' };
      if (request.status !== 'pending' && request.status !== 'accepted') return { error: 'invalid_state' };
      const changed = await transaction.rideRequest.updateMany({
        where: { id: request.id, status: request.status },
        data: { status },
      });
      if (changed.count !== 1) return { error: 'invalid_state' };

      if (request.status === 'accepted') {
        await transaction.trip.updateMany({
          where: { id: request.tripId, seatsAvailable: { lt: request.trip.seatsTotal } },
          data: { seatsAvailable: { increment: request.seats }, assentos: { increment: request.seats }, status: 'open' },
        });
      }

      const notifyUserId = status === 'refused' ? request.passengerId : request.trip.driverId;
      await transaction.notification.create({
        data: { userId: notifyUserId, tripId: request.tripId, type: status === 'refused' ? 'request_refused' : 'request_cancelled' },
      });
      return {
        request: await transaction.rideRequest.findUniqueOrThrow({
          where: { id: request.id },
          include: { passenger: { select: { id: true, nome: true } } },
        }),
      };
    });
  }

  async setTripStatus(tripId: string, driverId: string, status: TripStatus, expectedStatuses: TripStatus[]): Promise<Trip | null> {
    return this.prisma.$transaction(async (transaction) => {
      const changed = await transaction.trip.updateMany({
        where: { id: tripId, driverId, status: { in: expectedStatuses } },
        data: { status },
      });
      if (changed.count !== 1) return null;
      const trip = await transaction.trip.findUniqueOrThrow({ where: { id: tripId }, include: tripInclude });
      const notificationType = status === 'cancelled' ? 'trip_cancelled' : status === 'in_progress' ? 'trip_started' : status === 'finished' ? 'trip_finished' : null;
      if (status === 'cancelled') {
        const activeRequests = await transaction.rideRequest.findMany({
          where: { tripId, status: { in: ['pending', 'accepted'] } },
          select: { id: true, passengerId: true },
        });
        await transaction.rideRequest.updateMany({
          where: { tripId, status: { in: ['pending', 'accepted'] } },
          data: { status: 'cancelled' },
        });
        if (notificationType) {
          await transaction.notification.createMany({
            data: activeRequests.map((request) => ({ userId: request.passengerId, tripId, type: notificationType })),
          });
        }
      } else if (notificationType) {
        const passengers = await transaction.rideRequest.findMany({
          where: { tripId, status: 'accepted' },
          select: { passengerId: true },
        });
        if (passengers.length) {
          await transaction.notification.createMany({
            data: passengers.map(({ passengerId }) => ({ userId: passengerId, tripId, type: notificationType })),
          });
        }
      }
      return trip;
    });
  }

  async cancelTripRequests(tripId: string): Promise<void> {
    await this.prisma.rideRequest.updateMany({
      where: { tripId, status: { in: ['pending', 'accepted'] } },
      data: { status: 'cancelled' },
    });
  }

  async listNotifications(userId: string, includeWomenOnly: boolean): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId, ...(includeWomenOnly ? {} : { trip: { apenasMulheres: false } }) },
      include: { trip: { select: { origem: true, destino: true, departureAt: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  countUnreadNotifications(userId: string, includeWomenOnly: boolean): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false, ...(includeWomenOnly ? {} : { trip: { apenasMulheres: false } }) },
    });
  }

  async markNotificationsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  }

  async createRating(data: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    return this.prisma.$transaction(async (transaction) => {
      const rating = await transaction.rating.create({ data });
      await transaction.notification.create({
        data: { userId: data.subjectId, tripId: data.tripId, type: 'new_rating' },
      });
      return rating;
    }).catch(rethrowWriteError);
  }

  async findRating(tripId: string, authorId: string, subjectId: string): Promise<Rating | null> {
    return this.prisma.rating.findUnique({ where: { tripId_authorId_subjectId: { tripId, authorId, subjectId } } });
  }

  async getDriverRating(driverId: string): Promise<{ average: number; count: number }> {
    const aggregate = await this.prisma.rating.aggregate({
      where: { subjectId: driverId },
      _avg: { stars: true },
      _count: { _all: true },
    });
    return { average: aggregate._avg.stars ?? 0, count: aggregate._count._all };
  }
}
