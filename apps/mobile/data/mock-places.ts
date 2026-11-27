import type { Place } from '../src/types/place';

export const UNEX: Place = {
  id: 'unex',
  title: 'UNEX',
  subtitle: 'Recreio, Vitória da Conquista - BA',
  fullAddress: 'R. Ubaldino Figueira, 200 - Recreio, Vitória da Conquista - BA, 45020-510',
  latitude: -14.8643329,
  longitude: -40.8340098,
  city: 'Vitória da Conquista',
};

export const mockDestinations: Place[] = [
  {
    id: 'candido-sales',
    title: 'Rua Baraúnas, 1-119',
    subtitle: 'Cândido Sales - BA, 45157-000',
    fullAddress: 'Rua Baraúnas, 1-119 - Cândido Sales, BA, 45157-000',
    latitude: -15.5034093,
    longitude: -41.2329086,
    city: 'Cândido Sales',
  },
  {
    id: 'barra-do-choca',
    title: 'R. João Antônio Amorim, 201',
    subtitle: 'Barra do Choça - BA, 45120-000',
    fullAddress: 'R. João Antônio Amorim, 201 - Barra do Choça, BA, 45120-000',
    latitude: -14.8661995,
    longitude: -40.5782207,
    city: 'Barra do Choça',
    approximate: true,
  },
  {
    id: 'brumado',
    title: 'R. Wilson Parani, 22',
    subtitle: 'Centro, Brumado - BA, 46100-000',
    fullAddress: 'R. Wilson Parani, 22 - Centro, Brumado - BA, 46100-000',
    latitude: -14.2025099,
    longitude: -41.6701307,
    city: 'Brumado',
    approximate: true,
  },
];

export const mockPlaces: Place[] = [UNEX, ...mockDestinations];
