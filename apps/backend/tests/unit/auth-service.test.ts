import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RegisterInput } from '@viajunto/shared-types';

import { AuthService } from '../../src/services/auth-service.js';
import type { AuthRepository } from '../../src/repositories/auth-repository.js';

const user = {
  id: 'user-1',
  nome: 'Maria',
  email: 'maria@example.com',
  passwordHash: '',
  genero: 'F' as const,
  role: 'motorista' as const,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

function createRepository(): AuthRepository {
  return {
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn().mockResolvedValue({
      id: 'refresh-1',
      tokenHash: 'hash',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 100000),
      revokedAt: null,
      createdAt: new Date(),
    }),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
  };
}

describe('AuthService', () => {
  let repository: AuthRepository;
  let service: AuthService;

  beforeEach(() => {
    repository = createRepository();
    service = new AuthService(repository, 4);
  });

  it('rejects duplicate email during registration', async () => {
    vi.mocked(repository.findUserByEmail).mockResolvedValue(user);

    await expect(service.registerUser({
      nome: 'Maria',
      email: user.email,
      senha: 'Senha123',
      genero: 'F',
      role: 'motorista',
    })).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
  });

  it('rejects weak passwords during registration', async () => {
    await expect(service.registerUser({
      nome: 'Maria',
      email: user.email,
      senha: 'fraca',
      genero: 'F',
      role: 'motorista',
    })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });

  it('returns a session for valid credentials', async () => {
    user.passwordHash = await bcrypt.hash('Senha123', 4);
    vi.mocked(repository.findUserByEmail).mockResolvedValue(user);

    const session = await service.login({ email: user.email, senha: 'Senha123' });

    expect(session).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      expiresIn: 900,
    });
  });

  it.each([
    ['wrong password', 'wrong'],
    ['unknown email', 'unknown@example.com'],
  ])('uses the same error for %s', async (_label, emailOrPassword) => {
    if (emailOrPassword === 'wrong') {
      user.passwordHash = await bcrypt.hash('Senha123', 4);
      vi.mocked(repository.findUserByEmail).mockResolvedValue(user);
    } else {
      vi.mocked(repository.findUserByEmail).mockResolvedValue(null);
    }

    await expect(service.login({
      email: emailOrPassword === 'wrong' ? user.email : emailOrPassword,
      senha: emailOrPassword === 'wrong' ? emailOrPassword : 'Senha123',
    })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
      message: 'Credenciais inválidas',
    });
  });

  it('rejects expired refresh tokens', async () => {
    vi.mocked(repository.findRefreshToken).mockResolvedValue({
      id: 'refresh-1',
      tokenHash: 'hash',
      userId: user.id,
      expiresAt: new Date(Date.now() - 1),
      revokedAt: null,
      createdAt: new Date(),
    });

    await expect(service.refreshSession({ refreshToken: 'expired' }))
      .rejects.toMatchObject({ code: 'INVALID_REFRESH_TOKEN' });
  });
});
