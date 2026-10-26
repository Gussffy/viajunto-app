import { Router } from 'express';

import { asyncHandler } from '../middleware/async-handler.js';
import { createAuthController } from '../controllers/auth-controller.js';
import { AuthService } from '../services/auth-service.js';

export function createAuthRoutes(authService: AuthService): Router {
  const controller = createAuthController(authService);
  const router = Router();
  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.login));
  router.post('/refresh', asyncHandler(controller.refresh));
  return router;
}
