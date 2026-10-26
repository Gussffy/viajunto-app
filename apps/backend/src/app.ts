import express from 'express';
import { PrismaClient } from '@prisma/client';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { PrismaAuthRepository } from './repositories/prisma-auth-repository.js';
import { AuthService } from './services/auth-service.js';
import { createAuthRoutes } from './routes/auth-routes.js';
import { createUserRoutes } from './routes/user-routes.js';

export function createApp(authService: AuthService) {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/auth', createAuthRoutes(authService));
  app.use('/users', createUserRoutes(authService));
  app.use(errorHandler);
  return app;
}

export function createProductionApp() {
  const prisma = new PrismaClient();
  const repository = new PrismaAuthRepository(prisma);
  return { app: createApp(new AuthService(repository)), prisma };
}

export const port = env.PORT;
