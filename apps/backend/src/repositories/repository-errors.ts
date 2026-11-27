export class UniqueConstraintError extends Error {
  constructor(cause: unknown) {
    super('Restrição de unicidade violada', { cause });
    this.name = 'UniqueConstraintError';
  }
}
