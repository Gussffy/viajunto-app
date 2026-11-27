import { createProductionApp } from './bootstrap.js';
import { env } from './config/env.js';

const { app, disconnect } = createProductionApp();
const server = app.listen(env.PORT, () => {
  console.log(`Backend running at http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  server.close();
  await disconnect();
};

process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
