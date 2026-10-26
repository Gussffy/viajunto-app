import type { Gender, UserRole } from '@viajunto/shared-types';

export interface User {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  genero: Gender;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash' | 'updatedAt'>;
