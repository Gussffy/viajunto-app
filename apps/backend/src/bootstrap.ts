import { createApp } from './app.js';
import { createPrismaClient } from './repositories/prisma-client.js';
import { PrismaAuthRepository } from './repositories/prisma-auth-repository.js';
import { PrismaRideRepository } from './repositories/prisma-ride-repository.js';
import { AuthService } from './services/auth-service.js';
import { RideService } from './services/ride-service.js';

export function createProductionApp() {
  const prisma = createPrismaClient();
  const authService = new AuthService(new PrismaAuthRepository(prisma));
  const rideService = new RideService(new PrismaRideRepository(prisma));

  return {
    app: createApp(authService, rideService),
    disconnect: () => prisma.$disconnect(),
  };
}
