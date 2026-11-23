export type RideMode = 'pedir' | 'dar';
export type Role = 'motorista' | 'passageiro';

export type Ride = {
  id: string;
  origin: string;
  destination: string;
  stops: string[];
  date: string;
  time: string;
  price: number;
  seatsTotal: number;
  seatsAvailable: number;
  driver: {
    name: string;
    rating: number;
    trips: number;
    verified: boolean;
    vehicle: string;
    plate: string;
    color: string;
  };
  preferences: { label: string; key: string }[];
  status?: 'pendente' | 'confirmada' | 'andamento' | 'concluida';
};

export type RideRequest = {
  id: string;
  passenger: string;
  seats: number;
  status: 'pendente' | 'aceita' | 'recusada';
};

export const MOCK_RIDES: Ride[] = [
  {
    id: '1', origin: 'Vitória da Conquista', destination: 'Brumado', stops: ['Anagé'],
    date: 'Hoje', time: '07:30', price: 35, seatsTotal: 4, seatsAvailable: 3,
    driver: { name: 'Mariana Souza', rating: 4.9, trips: 128, verified: true, vehicle: 'Honda Civic', plate: 'PKJ-4B21', color: 'Prata' },
    preferences: [{ label: 'Ar-condicionado', key: 'ac' }, { label: 'Bagagem média', key: 'bag' }],
  },
  {
    id: '2', origin: 'Vitória da Conquista', destination: 'Brumado', stops: [],
    date: 'Hoje', time: '14:00', price: 32, seatsTotal: 4, seatsAvailable: 2,
    driver: { name: 'Carlos Andrade', rating: 4.7, trips: 84, verified: true, vehicle: 'Toyota Corolla', plate: 'RTA-9F10', color: 'Preto' },
    preferences: [{ label: 'Ar-condicionado', key: 'ac' }, { label: 'Pets', key: 'pets' }],
  },
  {
    id: '3', origin: 'Brumado', destination: 'Vitória da Conquista', stops: ['Caetité'],
    date: 'Amanhã', time: '06:15', price: 38, seatsTotal: 3, seatsAvailable: 1,
    driver: { name: 'Ana Pereira', rating: 5.0, trips: 210, verified: true, vehicle: 'Jeep Renegade', plate: 'JQA-2D33', color: 'Branco' },
    preferences: [{ label: 'Ar-condicionado', key: 'ac' }, { label: 'Bagagem grande', key: 'bag' }],
  },
  {
    id: '4', origin: 'Vitória da Conquista', destination: 'Feira de Santana', stops: ['Poções', 'Jequié'],
    date: 'Amanhã', time: '08:00', price: 95, seatsTotal: 4, seatsAvailable: 2,
    driver: { name: 'Rafael Lima', rating: 4.8, trips: 63, verified: false, vehicle: 'VW T-Cross', plate: 'PLM-7H55', color: 'Azul' },
    preferences: [{ label: 'Ar-condicionado', key: 'ac' }],
  },
];

export const MOCK_REQUESTS: RideRequest[] = [
  { id: 'r1', passenger: 'Lucas M.', seats: 1, status: 'pendente' },
  { id: 'r2', passenger: 'Juliana R.', seats: 2, status: 'pendente' },
  { id: 'r3', passenger: 'Pedro S.', seats: 1, status: 'aceita' },
];
