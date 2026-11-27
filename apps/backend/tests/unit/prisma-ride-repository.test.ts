import { Prisma, type PrismaClient } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import { PrismaRideRepository } from '../../src/repositories/prisma-ride-repository.js';
import { UniqueConstraintError } from '../../src/repositories/repository-errors.js';

function createRepository() {
  const tripSearch = vi.fn().mockResolvedValue([]);
  const requestSearch = vi.fn().mockResolvedValue([]);
  const notificationSearch = vi.fn().mockResolvedValue([]);
  const notificationCount = vi.fn().mockResolvedValue(0);
  const prisma = {
    trip: { findMany: tripSearch },
    rideRequest: { findMany: requestSearch },
    notification: { findMany: notificationSearch, count: notificationCount },
  };
  return {
    repository: new PrismaRideRepository(prisma as unknown as PrismaClient),
    tripSearch, requestSearch, notificationSearch, notificationCount,
  };
}

describe('PrismaRideRepository write errors', () => {
  it('translates Prisma uniqueness failures for requests and ratings', async () => {
    const duplicate = new Prisma.PrismaClientKnownRequestError('Duplicate record', {
      code: 'P2002',
      clientVersion: 'test',
    });
    const prisma = { $transaction: vi.fn().mockRejectedValue(duplicate) };
    const repository = new PrismaRideRepository(prisma as unknown as PrismaClient);

    await expect(repository.createRequest('trip', 'passenger', 1, 'pending'))
      .rejects.toBeInstanceOf(UniqueConstraintError);
    await expect(repository.createRating({
      tripId: 'trip', authorId: 'driver', subjectId: 'passenger', stars: 5, comment: null,
    })).rejects.toBeInstanceOf(UniqueConstraintError);
  });
});

describe('PrismaRideRepository trip visibility', () => {
  it.each([false, true])('passes the explicit exclusivity filter %s to Prisma', async (apenasMulheres) => {
    const { repository, tripSearch } = createRepository();

    await repository.searchTrips({ apenasMulheres });

    expect(tripSearch).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ apenasMulheres }),
    }));
  });

  it('omits the exclusivity filter when searching for all allowed trips', async () => {
    const { repository, tripSearch } = createRepository();

    await repository.searchTrips({});

    expect(tripSearch.mock.calls[0]?.[0].where).not.toHaveProperty('apenasMulheres');
  });

  it('filters exclusive trips from historical requests, notifications and unread counts', async () => {
    const { repository, requestSearch, notificationSearch, notificationCount } = createRepository();
    const trip = { apenasMulheres: false };

    await repository.findTripsByPassengerId('user-1', false);
    await repository.listNotifications('user-1', false);
    await repository.countUnreadNotifications('user-1', false);

    expect(requestSearch).toHaveBeenCalledWith(expect.objectContaining({ where: { passengerId: 'user-1', trip } }));
    expect(notificationSearch).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'user-1', trip } }));
    expect(notificationCount).toHaveBeenCalledWith({ where: { userId: 'user-1', read: false, trip } });
  });
});
