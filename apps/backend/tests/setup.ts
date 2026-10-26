process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ??= 'test-access-secret-long-enough';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-long-enough';
