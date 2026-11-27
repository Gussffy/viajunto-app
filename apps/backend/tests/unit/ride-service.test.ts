import { describe, expect, it, vi } from 'vitest';

import { RideService } from '../../src/services/ride-service.js';
import type { RideRepository } from '../../src/repositories/ride-repository.js';
import { UniqueConstraintError } from '../../src/repositories/repository-errors.js';

function createRepository(overrides: Partial<RideRepository> = {}): RideRepository {
  return {
    findUserById: vi.fn(),
    findVehicleByDriverId: vi.fn(),
    findVehicleByPlate: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
    createTrip: vi.fn(),
    searchTrips: vi.fn(),
    findTripById: vi.fn(),
    findTripsByDriverId: vi.fn(),
    findTripsByPassengerId: vi.fn(),
    findRequest: vi.fn(),
    findRequestById: vi.fn(),
    createRequest: vi.fn(),
    findRequestsByTrip: vi.fn(),
    acceptRequest: vi.fn(),
    transitionRequest: vi.fn(),
    setTripStatus: vi.fn(),
    cancelTripRequests: vi.fn(),
    listNotifications: vi.fn(),
    countUnreadNotifications: vi.fn(),
    markNotificationsRead: vi.fn(),
    createRating: vi.fn(),
    findRating: vi.fn(),
    getDriverRating: vi.fn(),
    ...overrides,
  };
}

describe('RideService', () => {
  const passenger = {
    id: 'p1', nome: 'Ana', email: 'ana@example.com', genero: 'F' as const, role: 'passageiro' as const, createdAt: new Date(),
  };
  const driver = {
    id: 'd1', nome: 'Maria', email: 'maria@example.com', genero: 'F' as const, role: 'motorista' as const, createdAt: new Date(),
  };
  const trip = {
    id: 't1', origem: 'Vitória da Conquista', origemLat: null, origemLng: null, destino: 'Brumado',
    destinoLat: null, destinoLng: null, departureAt: new Date(Date.now() + 86400000),
    assentos: 3, seatsTotal: 3, seatsAvailable: 3, ajudaCusto: 25, apenasMulheres: false,
    manualApproval: true, notes: null, status: 'open' as const, driverId: 'd1',
    createdAt: new Date(), updatedAt: new Date(),
  };

  it('creates a pending request for a passenger without reserving seats early', async () => {
    const request = { id: 'r1', tripId: 't1', passengerId: 'p1', seats: 1, status: 'pending' as const, createdAt: new Date() };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(passenger),
      findTripById: vi.fn().mockResolvedValue(trip),
      findRequest: vi.fn().mockResolvedValue(null),
      createRequest: vi.fn().mockResolvedValue({ request }),
    });

    await expect(new RideService(repository).createRequest('p1', 't1', { seats: 1 })).resolves.toEqual(request);
    expect(repository.createRequest).toHaveBeenCalledWith('t1', 'p1', 1, 'pending');
  });

  it('rejects duplicate requests for the same trip', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(passenger),
      findTripById: vi.fn().mockResolvedValue(trip),
      findRequest: vi.fn().mockResolvedValue({ id: 'r1' }),
    });

    await expect(new RideService(repository).createRequest('p1', 't1', { seats: 1 }))
      .rejects.toMatchObject({ code: 'REQUEST_ALREADY_EXISTS' });
  });

  it('returns the duplicate request conflict if the write loses a race', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(passenger),
      findTripById: vi.fn().mockResolvedValue(trip),
      findRequest: vi.fn().mockResolvedValue(null),
      createRequest: vi.fn().mockRejectedValue(new UniqueConstraintError(new Error('Duplicate record'))),
    });

    await expect(new RideService(repository).createRequest(passenger.id, trip.id, { seats: 1 }))
      .rejects.toMatchObject({ statusCode: 409, code: 'REQUEST_ALREADY_EXISTS' });
  });

  it('validates that only the trip owner can accept a request', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(driver),
      findRequestById: vi.fn().mockResolvedValue({ id: 'r1', trip: { ...trip, driverId: 'different-driver' } }),
    });

    await expect(new RideService(repository).acceptRequest('d1', 'r1'))
      .rejects.toMatchObject({ code: 'OWN_TRIP_ONLY' });
  });

  it('requires an accepted trip participant to submit a rating for its other participant', async () => {
    const acceptedRequest = { id: 'r1', tripId: 't1', passengerId: 'p1', seats: 1, status: 'accepted' as const, createdAt: new Date() };
    const finishedTrip = { ...trip, status: 'finished' as const };
    const rating = { id: 'rating1', tripId: 't1', authorId: 'd1', subjectId: 'p1', stars: 5, comment: null, createdAt: new Date() };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(driver),
      findTripById: vi.fn().mockResolvedValue(finishedTrip),
      findRequestsByTrip: vi.fn().mockResolvedValue([acceptedRequest]),
      findRating: vi.fn().mockResolvedValue(null),
      createRating: vi.fn().mockResolvedValue(rating),
    });

    await expect(new RideService(repository).createRating('d1', 't1', { subjectId: 'p1', stars: 5 }))
      .resolves.toEqual(rating);
  });

  it('blocks a motorista from searching trips', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'João', email: 'joao@example.com', genero: 'M', role: 'motorista', createdAt: new Date(),
      }),
    });
    const service = new RideService(repository);

    await expect(service.searchTrips('u1', {}))
      .rejects.toMatchObject({ code: 'PASSENGER_REQUIRED' });
  });

  it('blocks a passageiro from publishing a trip', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'Ana', email: 'ana@example.com', genero: 'F', role: 'passageiro', createdAt: new Date(),
      }),
    });
    const service = new RideService(repository);

    await expect(service.createTrip('u1', {
      destinoLat: 0, destinoLng: 0, manualApproval: false, notes: "", origemLat: 0, origemLng: 0,
      origem: 'Vitória da Conquista',
      destino: 'Brumado',
      departureAt: '2099-12-01T08:00:00.000Z',
      assentos: 3,
      ajudaCusto: 25,
      apenasMulheres: false
    })).rejects.toMatchObject({ code: 'DRIVER_REQUIRED' });
  });
  it('rejects vehicle registration for passengers', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'Ana', email: 'ana@example.com', genero: 'F', role: 'passageiro', createdAt: new Date(),
      }),
    });
    const service = new RideService(repository);

    await expect(service.createVehicle('u1', { placa: 'ABC1D23', modelo: 'Onix', cor: 'Branco', lugares: 4 }))
      .rejects.toMatchObject({ code: 'DRIVER_REQUIRED' });
  });

  it('rejects women-only trips from non-female drivers', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'João', email: 'joao@example.com', genero: 'M', role: 'motorista', createdAt: new Date(),
      }),
    });
    const service = new RideService(repository);

    await expect(service.createTrip('u1', {
      destinoLat: 0, destinoLng: 0, manualApproval: false, notes: "", origemLat: 0, origemLng: 0,
      origem: 'Vitória da Conquista',
      destino: 'Brumado',
      departureAt: '2099-12-01T08:00:00.000Z',
      assentos: 3,
      ajudaCusto: 25,
      apenasMulheres: true
    })).rejects.toMatchObject({ code: 'WOMEN_ONLY_DRIVER_REQUIRED' });
  });

  it('allows a female driver to publish an exclusive trip', async () => {
    const exclusiveTrip = { ...trip, apenasMulheres: true };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(driver),
      findVehicleByDriverId: vi.fn().mockResolvedValue({ lugares: 4 }),
      createTrip: vi.fn().mockResolvedValue(exclusiveTrip),
    });

    await expect(new RideService(repository).createTrip(driver.id, {
      destinoLat: 0, destinoLng: 0, manualApproval: false, notes: "", origemLat: 0, origemLng: 0,
      origem: trip.origem,
      destino: trip.destino,
      departureAt: trip.departureAt.toISOString(),
      assentos: trip.assentos,
      ajudaCusto: trip.ajudaCusto,
      apenasMulheres: true
    })).resolves.toEqual(exclusiveTrip);
    expect(repository.createTrip).toHaveBeenCalledWith(expect.objectContaining({
      driverId: driver.id, apenasMulheres: true,
    }));
  });

  it.each(['M', 'OUTRO'] as const)('restricts search and activity for passenger gender %s', async (genero) => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({ ...passenger, genero }),
    });
    const service = new RideService(repository);

    await service.searchTrips(passenger.id, {});
    await service.searchTrips(passenger.id, { apenasMulheres: 'true' });
    await service.getPassengerTrips(passenger.id);
    await service.listNotifications(passenger.id);
    await service.getNotificationCount(passenger.id);

    expect(repository.searchTrips).toHaveBeenNthCalledWith(1, expect.objectContaining({ apenasMulheres: false }));
    expect(repository.searchTrips).toHaveBeenNthCalledWith(2, expect.objectContaining({ apenasMulheres: false }));
    expect(repository.findTripsByPassengerId).toHaveBeenCalledWith(passenger.id, false);
    expect(repository.listNotifications).toHaveBeenCalledWith(passenger.id, false);
    expect(repository.countUnreadNotifications).toHaveBeenCalledWith(passenger.id, false);
  });

  it.each(['M', 'OUTRO'] as const)('treats exclusive trips as unavailable by ID for passenger gender %s', async (genero) => {
    const exclusiveTrip = { ...trip, status: 'finished' as const, apenasMulheres: true };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({ ...passenger, genero }),
      findTripById: vi.fn().mockResolvedValue(exclusiveTrip),
      findRequestById: vi.fn().mockResolvedValue({ id: 'r1', passengerId: passenger.id, trip: exclusiveTrip }),
    });
    const service = new RideService(repository);
    const missingTrip = { statusCode: 404, code: 'TRIP_NOT_FOUND', message: 'Viagem não encontrada' };

    await expect(service.getTrip(passenger.id, trip.id)).rejects.toMatchObject(missingTrip);
    await expect(service.createRequest(passenger.id, trip.id, { seats: 1 })).rejects.toMatchObject(missingTrip);
    await expect(service.cancelRequest(passenger.id, 'r1')).rejects.toMatchObject(missingTrip);
    await expect(service.createRating(passenger.id, trip.id, { subjectId: driver.id, stars: 5 })).rejects.toMatchObject(missingTrip);
    expect(repository.createRequest).not.toHaveBeenCalled();
    expect(repository.transitionRequest).not.toHaveBeenCalled();
    expect(repository.createRating).not.toHaveBeenCalled();
  });

  it('lets a female passenger see exclusive trips in all listings and request a seat', async () => {
    const exclusiveTrip = { ...trip, apenasMulheres: true };
    const request = { id: 'r1', status: 'pending' };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(passenger),
      findTripById: vi.fn().mockResolvedValue(exclusiveTrip),
      createRequest: vi.fn().mockResolvedValue({ request }),
    });
    const service = new RideService(repository);

    await service.searchTrips(passenger.id, {});
    await service.searchTrips(passenger.id, { apenasMulheres: 'true' });
    await service.getPassengerTrips(passenger.id);
    await service.listNotifications(passenger.id);
    await service.getNotificationCount(passenger.id);

    expect(repository.searchTrips).toHaveBeenNthCalledWith(1, expect.objectContaining({ apenasMulheres: undefined }));
    expect(repository.searchTrips).toHaveBeenNthCalledWith(2, expect.objectContaining({ apenasMulheres: true }));
    expect(repository.findTripsByPassengerId).toHaveBeenCalledWith(passenger.id, true);
    expect(repository.listNotifications).toHaveBeenCalledWith(passenger.id, true);
    expect(repository.countUnreadNotifications).toHaveBeenCalledWith(passenger.id, true);
    await expect(service.getTrip(passenger.id, trip.id)).resolves.toEqual(exclusiveTrip);
    await expect(service.createRequest(passenger.id, trip.id, { seats: 1 })).resolves.toEqual(request);
  });

  it('preserves access to public trip details and the driver’s own exclusive trip', async () => {
    const exclusiveTrip = { ...trip, apenasMulheres: true };
    const repository = createRepository({
      findUserById: vi.fn().mockImplementation(async (userId: string) =>
        userId === driver.id ? driver : { ...passenger, genero: 'M' },
      ),
      findTripById: vi.fn().mockImplementation(async (id: string) => id === 'private' ? exclusiveTrip : trip),
    });
    const service = new RideService(repository);

    await expect(service.getTrip(passenger.id, trip.id)).resolves.toEqual(trip);
    await expect(service.getTrip(driver.id, 'private')).resolves.toEqual(exclusiveTrip);
  });

  it('requires a registered vehicle before publishing a trip', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'Maria', email: 'maria@example.com', genero: 'F', role: 'motorista', createdAt: new Date(),
      }),
      findVehicleByDriverId: vi.fn().mockResolvedValue(null),
    });
    const service = new RideService(repository);

    await expect(service.createTrip('u1', {
      destinoLat: 0, destinoLng: 0, manualApproval: false, notes: "", origemLat: 0, origemLng: 0,
      origem: 'Vitória da Conquista',
      destino: 'Brumado',
      departureAt: '2099-12-01T08:00:00.000Z',
      assentos: 3,
      ajudaCusto: 25,
      apenasMulheres: false
    }))    .rejects.toMatchObject({ code: 'VEHICLE_REQUIRED' });
  });

  it('creates a vehicle for a driver', async () => {
    const vehicle = {
      id: 'v1', placa: 'ABC1D23', modelo: 'Onix', cor: 'Branco', lugares: 4,
      driverId: 'u1', createdAt: new Date(), updatedAt: new Date(),
    };
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue({
        id: 'u1', nome: 'Maria', email: 'maria@example.com', genero: 'F', role: 'motorista', createdAt: new Date(),
      }),
      findVehicleByDriverId: vi.fn().mockResolvedValue(null),
      findVehicleByPlate: vi.fn().mockResolvedValue(null),
      createVehicle: vi.fn().mockResolvedValue(vehicle),
    });
    const service = new RideService(repository);

    await expect(service.createVehicle('u1', { placa: 'ABC1D23', modelo: 'Onix', cor: 'Branco', lugares: 4 }))
      .resolves.toEqual(vehicle);
  });

  it('rejects invalid vehicle plate formats', async () => {
    const repository = createRepository({
      findUserById: vi.fn().mockResolvedValue(driver),
    });

    await expect(new RideService(repository).createVehicle('d1', {
      placa: 'INVALID1', modelo: 'Onix', cor: 'Branco', lugares: 4,
    })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
