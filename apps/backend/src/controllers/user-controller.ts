import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../errors/app-error.js';
import { AuthService } from '../services/auth-service.js';

export function createUserController(authService: AuthService) {
  const getMe: RequestHandler = async (req, res) => {
    if (!req.userId) {
      throw new UnauthorizedError();
    }
    const user = await authService.getUserById(req.userId);
    res.json(user);
  };

  return { getMe };
}
