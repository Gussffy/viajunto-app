import { z } from 'zod';

export const genderSchema = z.enum(['F', 'M', 'OUTRO']);
export const roleSchema = z.enum(['motorista', 'passageiro']);

export const registerSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  senha: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
  genero: genderSchema,
  role: roleSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  senha: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type UserRole = z.infer<typeof roleSchema>;
