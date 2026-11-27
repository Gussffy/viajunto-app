const fs = require('node:fs');
const path = require('node:path');

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';
const routes = [
  { key: 'unex-candido-sales', origin: [-40.8340098, -14.8643329], destination: [-41.2329086, -15.5034093] },
  { key: 'unex-barra-do-choca', origin: [-40.8340098, -14.8643329], destination: [-40.5782207, -14.8661995] },
  { key: 'unex-brumado', origin: [-40.8340098, -14.8643329], destination: [-41.6701307, -14.2025099] },
];

async function main() {
  const output = {};

  for (const route of routes) {
    const [lonO, latO] = route.origin;
    const [lonD, latD] = route.destination;
    const url = `${OSRM_BASE}/${lonO},${latO};${lonD},${latD}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM respondeu ${response.status}`);
    const body = await response.json();
    const routeResult = body.routes?.[0];
    if (!routeResult) throw new Error(`Sem rota para ${route.key}`);

    output[route.key] = {
      coordinates: routeResult.geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      })),
      distanceKm: routeResult.distance / 1000,
      durationMin: routeResult.duration / 60,
    };
  }

  const target = path.resolve(__dirname, '..', 'data', 'mockRoutes.json');
  fs.writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Rotas salvas em ${target}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
