import type { RequestHandler } from 'express';

import { AuthService } from '../services/auth-service.js';

export function createAuthController(authService: AuthService) {
  const register: RequestHandler = async (req, res) => {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  };

  const login: RequestHandler = async (req, res) => {
    const session = await authService.login(req.body);
    res.json(session);
  };

  const refresh: RequestHandler = async (req, res) => {
    const session = await authService.refreshSession(req.body);
    res.json(session);
  };

  return { register, login, refresh };
}
