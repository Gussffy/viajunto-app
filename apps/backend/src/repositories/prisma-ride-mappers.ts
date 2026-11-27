import type { Prisma } from '@prisma/client';

import type { RideRequest, Trip } from '../models/rides.js';

export const tripInclude = {
  driver: {
    select: {
      id: true,
      nome: true,
      genero: true,
      vehicle: { select: { modelo: true, cor: true, lugares: true } },
      ratingsReceived: { select: { stars: true } },
    },
  },
  requests: {
    include: { passenger: { select: { id: true, nome: true, ratingsReceived: { select: { stars: true } } } } },
  },
} satisfies Prisma.TripInclude;

type IncludedTrip = Prisma.TripGetPayload<{ include: typeof tripInclude }>;

export function mapTrip(trip: IncludedTrip): Trip {
  const driverRatingCount = trip.driver.ratingsReceived.length;
  return {
    ...trip,
    driver: {
      id: trip.driver.id,
      nome: trip.driver.nome,
      genero: trip.driver.genero,
      ratingAverage: driverRatingCount
        ? trip.driver.ratingsReceived.reduce((total, rating) => total + rating.stars, 0) / driverRatingCount
        : null,
      ratingCount: driverRatingCount,
    },
    vehicle: trip.driver.vehicle,
    requests: trip.requests.map((request) => {
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
    }),
  };
}

export function mapRequest(request: Prisma.RideRequestGetPayload<{
  include: {
    passenger: { select: { id: true; nome: true; ratingsReceived: { select: { stars: true } } } };
    trip: { include: typeof tripInclude };
  };
}>): RideRequest {
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
    trip: mapTrip(request.trip),
  };
}

