import bcrypt from 'bcrypt';

import {
  loginSchema,
  refreshSchema,
  registerSchema,
  type LoginInput,
  type RefreshInput,
  type RegisterInput,
} from '@viajunto/shared-types';

import { ConflictError, UnauthorizedError, ValidationError } from '../errors/app-error.js';
import type { PublicUser } from '../models/user.js';
import type { AuthRepository } from '../repositories/auth-repository.js';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from './token-service.js';

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwordHashRounds = 10,
  ) {}

  async registerUser(input: RegisterInput): Promise<PublicUser> {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError();
    }

    const data = parsed.data;
    const existingUser = await this.repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS', 'E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(data.senha, this.passwordHashRounds);
    const user = await this.repository.createUser({
      nome: data.nome,
      email: data.email,
      passwordHash,
      genero: data.genero,
      role: data.role,
    });
    return this.toPublicUser(user);
  }

  async login(input: LoginInput): Promise<Session> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError();
    }

    const user = await this.repository.findUserByEmail(parsed.data.email);
    const passwordMatches = user
      ? await bcrypt.compare(parsed.data.senha, user.passwordHash)
      : false;
    if (!user || !passwordMatches) {
      throw new UnauthorizedError('INVALID_CREDENTIALS', 'Credenciais inválidas');
    }

    return this.createSession(user.id);
  }

  async refreshSession(input: RefreshInput): Promise<Session> {
    const parsed = refreshSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError();
    }

    const tokenHash = hashRefreshToken(parsed.data.refreshToken);
    const storedToken = await this.repository.findRefreshToken(tokenHash);
    if (
      !storedToken ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedError('INVALID_REFRESH_TOKEN', 'Refresh token inválido');
    }

    await this.repository.revokeRefreshToken(storedToken.id);
    return this.createSession(storedToken.userId);
  }

  async getUserById(id: string): Promise<PublicUser> {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new UnauthorizedError();
    }
    return this.toPublicUser(user);
  }

  private async createSession(userId: string): Promise<Session> {
    const refreshToken = createRefreshToken();
    await this.repository.createRefreshToken({
      tokenHash: hashRefreshToken(refreshToken),
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    });
    return {
      accessToken: createAccessToken(userId),
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };
  }

  private toPublicUser(user: {
    id: string;
    nome: string;
    email: string;
    genero: PublicUser['genero'];
    role: PublicUser['role'];
    createdAt: Date;
  }): PublicUser {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      genero: user.genero,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
