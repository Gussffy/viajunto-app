import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

import { createPrismaClient } from '../src/repositories/prisma-client.js';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
const prisma = createPrismaClient();

const routes = [
  {
    id: 'demo-trip-candido-sales',
    destino: 'Rua Baraúnas, 1-119 - Cândido Sales, BA, 45157-000',
    destinoLat: -15.5034093,
    destinoLng: -41.2329086,
    ajudaCusto: 25,
  },
  {
    id: 'demo-trip-barra-do-choca',
    destino: 'R. João Antônio Amorim, 201 - Barra do Choça, BA, 45120-000',
    destinoLat: -14.8661995,
    destinoLng: -40.5782207,
    ajudaCusto: 20,
  },
  {
    id: 'demo-trip-brumado',
    destino: 'R. Wilson Parani, 22 - Centro, Brumado - BA, 46100-000',
    destinoLat: -14.2025099,
    destinoLng: -41.6701307,
    ajudaCusto: 40,
  },
] as const;

async function resetDemoData() {
  const databaseUrl = process.env.DATABASE_URL;
  const demoPassword = process.env.DEMO_PASSWORD;
  if (!databaseUrl || !demoPassword || demoPassword.length < 8) {
    throw new Error('Defina DATABASE_URL e DEMO_PASSWORD (mínimo 8 caracteres) no ambiente local.');
  }
  const hostname = new URL(databaseUrl).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(hostname)) {
    throw new Error('Por segurança, os dados de demonstração só podem ser resetados em um banco local.');
  }

  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const driver = await prisma.user.upsert({
    where: { email: 'motorista.demo@viajunto.local' },
    create: { nome: 'Marina Demonstração', email: 'motorista.demo@viajunto.local', passwordHash, genero: 'F', role: 'motorista' },
    update: { passwordHash, genero: 'F', role: 'motorista' },
  });
  await prisma.user.upsert({
    where: { email: 'passageira.demo@viajunto.local' },
    create: { nome: 'Ana Demonstração', email: 'passageira.demo@viajunto.local', passwordHash, genero: 'F', role: 'passageiro' },
    update: { passwordHash, genero: 'F', role: 'passageiro' },
  });
  await prisma.vehicle.upsert({
    where: { driverId: driver.id },
    create: { driverId: driver.id, placa: 'VJT1A23', modelo: 'Veículo de demonstração', cor: 'Azul', lugares: 4 },
    update: { placa: 'VJT1A23', modelo: 'Veículo de demonstração', cor: 'Azul', lugares: 4 },
  });

  await prisma.$transaction(async (transaction) => {
    const tripIds = routes.map((route) => route.id);
    await transaction.rideRequest.deleteMany({ where: { tripId: { in: tripIds } } });
    await transaction.rating.deleteMany({ where: { tripId: { in: tripIds } } });
    await transaction.notification.deleteMany({ where: { tripId: { in: tripIds } } });
    for (const [index, route] of routes.entries()) {
      const departureAt = new Date();
      departureAt.setDate(departureAt.getDate() + index + 1);
      departureAt.setHours(8, 0, 0, 0);
      await transaction.trip.upsert({
        where: { id: route.id },
        create: {
          id: route.id,
          driverId: driver.id,
          origem: 'UNEX — R. Ubaldino Figueira, 200 - Recreio, Vitória da Conquista - BA, 45020-510',
          origemLat: -14.8643329,
          origemLng: -40.8340098,
          destino: route.destino,
          destinoLat: route.destinoLat,
          destinoLng: route.destinoLng,
          departureAt,
          assentos: 4,
          seatsTotal: 4,
          seatsAvailable: 4,
          ajudaCusto: route.ajudaCusto,
          apenasMulheres: false,
          manualApproval: true,
          status: 'open',
        },
        update: {
          driverId: driver.id,
          origem: 'UNEX — R. Ubaldino Figueira, 200 - Recreio, Vitória da Conquista - BA, 45020-510',
          origemLat: -14.8643329,
          origemLng: -40.8340098,
          destino: route.destino,
          destinoLat: route.destinoLat,
          destinoLng: route.destinoLng,
          departureAt,
          assentos: 4,
          seatsTotal: 4,
          seatsAvailable: 4,
          ajudaCusto: route.ajudaCusto,
          apenasMulheres: false,
          manualApproval: true,
          notes: null,
          status: 'open',
        },
      });
    }
  });
  console.log('Dados de demonstração reiniciados: 3 rotas UNEX, motorista e passageira.');
  console.log('Contas: motorista.demo@viajunto.local e passageira.demo@viajunto.local; senha: valor de DEMO_PASSWORD.');
}

resetDemoData().finally(() => prisma.$disconnect());
