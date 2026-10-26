import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

import { requireAuth } from '../../src/middleware/auth-middleware.js';
import { createAccessToken } from '../../src/services/token-service.js';

function requestWithAuthorization(value?: string) {
  return {
    header: (name: string) => name === 'authorization' ? value : undefined,
  } as Parameters<typeof requireAuth>[0];
}

describe('requireAuth', () => {
  it('accepts a valid JWT', () => {
    const next = () => undefined;
    const request = requestWithAuthorization(`Bearer ${createAccessToken('user-1')}`);

    requireAuth(request, {} as never, next);

    expect(request.userId).toBe('user-1');
  });

  it.each([
    ['missing', undefined],
    ['invalid', 'Bearer invalid'],
    ['expired', `Bearer ${jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET, { expiresIn: -1 })}`],
  ])('rejects %s JWT', (_label, authorization) => {
    let receivedError: unknown;
    const request = requestWithAuthorization(authorization);

    requireAuth(request, {} as never, (error) => {
      receivedError = error;
    });

    expect(receivedError).toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
