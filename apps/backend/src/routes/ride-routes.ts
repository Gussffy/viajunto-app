import { Router } from 'express';

import { createRideController } from '../controllers/ride-controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth-middleware.js';
import type { RideService } from '../services/ride-service.js';

export function createRideRoutes(service: RideService): Router {
  const controller = createRideController(service);
  const router = Router();
  router.post('/vehicles', requireAuth, asyncHandler(controller.createVehicle));
  router.get('/vehicles/me', requireAuth, asyncHandler(controller.getMyVehicle));
  router.put('/vehicles/me', requireAuth, asyncHandler(controller.updateVehicle));
  router.post('/trips', requireAuth, asyncHandler(controller.createTrip));
  router.get('/trips/mine', requireAuth, asyncHandler(controller.getMyTrips));
  router.get('/requests/mine', requireAuth, asyncHandler(controller.getPassengerTrips));
  router.get('/trips/:id/requests', requireAuth, asyncHandler(controller.getTripRequests));
  router.post('/trips/:id/requests', requireAuth, asyncHandler(controller.createRequest));
  router.post('/requests/:requestId/accept', requireAuth, asyncHandler(controller.acceptRequest));
  router.post('/requests/:requestId/refuse', requireAuth, asyncHandler(controller.refuseRequest));
  router.post('/requests/:requestId/cancel', requireAuth, asyncHandler(controller.cancelRequest));
  router.post('/trips/:id/ratings', requireAuth, asyncHandler(controller.createRating));
  router.post('/trips/:id/:action', requireAuth, asyncHandler(controller.tripAction));
  router.get('/notifications/count', requireAuth, asyncHandler(controller.notificationCount));
  router.get('/notifications', requireAuth, asyncHandler(controller.listNotifications));
  router.post('/notifications/read', requireAuth, asyncHandler(controller.markNotificationsRead));
  router.get('/trips', requireAuth, asyncHandler(controller.searchTrips));
  router.get('/trips/:id', requireAuth, asyncHandler(controller.getTrip));
  return router;
}
