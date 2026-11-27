import type { User } from '../types';
import { api } from './api';

type Credentials = { email: string; senha: string };
type Registration = Credentials & { nome: string; genero: User['genero'] | null; role: User['role'] };
type SessionTokens = { accessToken: string; refreshToken: string };

export function register(data: Registration) {
  return api('/auth/register', null, { method: 'POST', body: JSON.stringify(data) });
}

export function login(data: Credentials) {
  return api<SessionTokens>('/auth/login', null, { method: 'POST', body: JSON.stringify(data) });
}

export function refreshSession(refreshToken: string) {
  return api<SessionTokens>('/auth/refresh', null, { method: 'POST', body: JSON.stringify({ refreshToken }) });
}

export function getCurrentUser(token: string) {
  return api<User>('/users/me', token);
}
