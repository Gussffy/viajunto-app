import express from 'express';

import { cors } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { createAuthRoutes } from './routes/auth-routes.js';
import { createRideRoutes } from './routes/ride-routes.js';
import { createUserRoutes } from './routes/user-routes.js';
import type { AuthService } from './services/auth-service.js';
import type { RideService } from './services/ride-service.js';

export function createApp(authService: AuthService, rideService?: RideService) {
  const app = express();
  app.use(express.json());
  app.use(cors);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', createAuthRoutes(authService));
  app.use('/users', createUserRoutes(authService));
  if (rideService) app.use('/', createRideRoutes(rideService));
  app.use(errorHandler);

  return app;
}
