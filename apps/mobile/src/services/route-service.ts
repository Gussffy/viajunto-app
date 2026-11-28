import mockRoutes from '../../data/mockRoutes.json';
import { mockDestinations, UNEX } from '../../data/mock-places';
import type { Place } from '../types/place';

export type RouteResult = {
  coordinates: { latitude: number; longitude: number }[];
  distanceKm: number;
  durationMin: number;
};

type OfflineRouteMap = Record<string, RouteResult>;

const routeCache = new Map<string, RouteResult>();

type Point = Pick<Place, 'latitude' | 'longitude'>;

function samePoint(first: Point, second: Point) {
  return first.latitude === second.latitude && first.longitude === second.longitude;
}

function offlineRoute(origin: Point, destination: Point): RouteResult | null {
  const fromUnex = samePoint(origin, UNEX);
  if (!fromUnex && !samePoint(destination, UNEX)) return null;

  const other = fromUnex ? destination : origin;
  const known = mockDestinations.find((place) => samePoint(place, other));
  const route = known && (mockRoutes as OfflineRouteMap)[`unex-${known.id}`];
  if (!route) return null;
  return fromUnex ? route : { ...route, coordinates: [...route.coordinates].reverse() };
}

export async function getRoute(origin: Point, destination: Point): Promise<RouteResult> {
  const key = `${origin.latitude},${origin.longitude}:${destination.latitude},${destination.longitude}`;
  const cached = routeCache.get(key);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
      `?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('OSRM_UNAVAILABLE');
    const body = await response.json() as {
      routes?: Array<{ geometry: { coordinates: [number, number][] }; distance: number; duration: number }>;
    };
    const route = body.routes?.[0];
    if (!route) throw new Error('ROUTE_NOT_FOUND');

    const result: RouteResult = {
      coordinates: route.geometry.coordinates.map(([longitude, latitude]) => ({ latitude, longitude })),
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    };
    routeCache.set(key, result);
    return result;
  } catch {
    const fallback = offlineRoute(origin, destination);
    if (fallback) return fallback;
    throw new Error('Não foi possível traçar a rota. Verifique sua internet.');
  } finally {
    clearTimeout(timeout);
  }
}
