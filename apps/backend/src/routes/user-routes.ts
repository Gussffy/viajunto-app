import { Router } from 'express';

import { createUserController } from '../controllers/user-controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth-middleware.js';
import { AuthService } from '../services/auth-service.js';

export function createUserRoutes(authService: AuthService): Router {
  const controller = createUserController(authService);
  const router = Router();
  router.get('/me', requireAuth, asyncHandler(controller.getMe));
  return router;
}
