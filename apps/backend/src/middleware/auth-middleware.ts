import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../errors/app-error.js';
import { verifyAccessToken } from '../services/token-service.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorization = req.header('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    next(new UnauthorizedError());
    return;
  }

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) {
    next(new UnauthorizedError());
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch (error) {
    next(error);
  }
};
