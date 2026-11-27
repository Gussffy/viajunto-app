import type { Place } from '../types/place';

export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function filterPlaces(places: Place[], query: string): Place[] {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return places;
  return places.filter((place) =>
    normalizeText(`${place.title} ${place.subtitle} ${place.city}`).includes(normalizedQuery),
  );
}

export function distanceKm(origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }): number {
  const earthRadiusKm = 6371;
  const latOrigin = origin.latitude * Math.PI / 180;
  const latDestination = destination.latitude * Math.PI / 180;
  const latDelta = (destination.latitude - origin.latitude) * Math.PI / 180;
  const lngDelta = (destination.longitude - origin.longitude) * Math.PI / 180;
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(latOrigin) * Math.cos(latDestination) * Math.sin(lngDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

export function nearestMockPlace(place: { latitude: number; longitude: number }, places: Place[]): { place: Place | null; distanceKm: number } {
  let nearest: Place | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of places) {
    const candidateDistance = distanceKm(place, candidate);
    if (candidateDistance < nearestDistance) {
      nearest = candidate;
      nearestDistance = candidateDistance;
    }
  }
  return { place: nearest, distanceKm: nearestDistance };
}
