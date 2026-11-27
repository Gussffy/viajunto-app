import type { RequestHandler } from 'express';

import type { RideService } from '../services/ride-service.js';

function routeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function createRideController(service: RideService) {
  const createVehicle: RequestHandler = async (req, res) => {
    const vehicle = await service.createVehicle(req.userId!, req.body);
    res.status(201).json(vehicle);
  };
  const getMyVehicle: RequestHandler = async (req, res) => {
    res.json(await service.getMyVehicle(req.userId!));
  };
  const updateVehicle: RequestHandler = async (req, res) => {
    res.json(await service.updateVehicle(req.userId!, req.body));
  };
  const createTrip: RequestHandler = async (req, res) => {
    const trip = await service.createTrip(req.userId!, req.body);
    res.status(201).json(trip);
  };
  const searchTrips: RequestHandler = async (req, res) => {
    res.json(await service.searchTrips(req.userId!, {
      origem: typeof req.query.origem === 'string' ? req.query.origem : undefined,
      destino: typeof req.query.destino === 'string' ? req.query.destino : undefined,
      date: typeof req.query.date === 'string' ? req.query.date : undefined,
      passengers: typeof req.query.passengers === 'string' ? Number(req.query.passengers) : undefined,
      apenasMulheres: typeof req.query.apenasMulheres === 'string' ? req.query.apenasMulheres as 'true' | 'false' : undefined,
    }));
  };
  const getTrip: RequestHandler = async (req, res) => {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    res.json(await service.getTrip(req.userId!, id));
  };
  const getMyTrips: RequestHandler = async (req, res) => {
    res.json(await service.getMyTrips(req.userId!));
  };
  const getPassengerTrips: RequestHandler = async (req, res) => {
    res.json(await service.getPassengerTrips(req.userId!));
  };
  const getTripRequests: RequestHandler = async (req, res) => {
    res.json(await service.getTripRequests(req.userId!, routeParam(req.params.id)));
  };
  const createRequest: RequestHandler = async (req, res) => {
    res.status(201).json(await service.createRequest(req.userId!, routeParam(req.params.id), req.body));
  };
  const acceptRequest: RequestHandler = async (req, res) => {
    res.json(await service.acceptRequest(req.userId!, routeParam(req.params.requestId)));
  };
  const refuseRequest: RequestHandler = async (req, res) => {
    res.json(await service.refuseRequest(req.userId!, routeParam(req.params.requestId)));
  };
  const cancelRequest: RequestHandler = async (req, res) => {
    res.json(await service.cancelRequest(req.userId!, routeParam(req.params.requestId)));
  };
  const tripAction: RequestHandler = async (req, res) => {
    const action = routeParam(req.params.action);
    if (action !== 'start' && action !== 'finish' && action !== 'cancel') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ação não encontrada' } });
      return;
    }
    res.json(await service.changeTripStatus(req.userId!, routeParam(req.params.id), action));
  };
  const createRating: RequestHandler = async (req, res) => {
    res.status(201).json(await service.createRating(req.userId!, routeParam(req.params.id), req.body));
  };
  const listNotifications: RequestHandler = async (req, res) => {
    res.json(await service.listNotifications(req.userId!));
  };
  const notificationCount: RequestHandler = async (req, res) => {
    res.json({ count: await service.getNotificationCount(req.userId!) });
  };
  const markNotificationsRead: RequestHandler = async (req, res) => {
    res.json(await service.markNotificationsRead(req.userId!));
  };
  return {
    createVehicle, getMyVehicle, updateVehicle, createTrip, searchTrips, getTrip, getMyTrips,
    getPassengerTrips, getTripRequests, createRequest, acceptRequest, refuseRequest,
    cancelRequest, tripAction, createRating, listNotifications, notificationCount, markNotificationsRead,
  };
}
