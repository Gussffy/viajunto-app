import { createProductionApp, port } from './app.js';

const { app, prisma } = createProductionApp();
const server = app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
};

process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
