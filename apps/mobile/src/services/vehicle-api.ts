import type { Vehicle } from '../types';
import { api } from './api';

type VehicleInput = Pick<Vehicle, 'placa' | 'modelo' | 'cor' | 'lugares'>;

export function getVehicle(token: string) {
  return api<Vehicle>('/vehicles/me', token);
}

export function saveVehicle(token: string, editing: boolean, data: VehicleInput) {
  return api<Vehicle>(editing ? '/vehicles/me' : '/vehicles', token, {
    method: editing ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  });
}
