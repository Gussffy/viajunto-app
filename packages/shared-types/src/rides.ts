import { z } from 'zod';

export const vehicleSchema = z.object({
  placa: z.string().trim().transform((value) => value.toUpperCase().replace(/-/g, ''))
    .refine((value) => /^[A-Z]{3}(?:[0-9]{4}|[0-9][A-Z][0-9]{2})$/.test(value), {
      message: 'Informe uma placa válida (padrão antigo ou Mercosul)',
    }),
  modelo: z.string().trim().min(2).max(80),
  cor: z.string().trim().min(2).max(40),
  lugares: z.number().int().min(1).max(8),
});

export const tripSchema = z.object({
  origem: z.string().trim().min(2).max(120),
  origemLat: z.number().min(-90).max(90).optional(),
  origemLng: z.number().min(-180).max(180).optional(),
  destino: z.string().trim().min(2).max(120),
  destinoLat: z.number().min(-90).max(90).optional(),
  destinoLng: z.number().min(-180).max(180).optional(),
  departureAt: z.string().datetime(),
  assentos: z.number().int().min(1).max(8),
  ajudaCusto: z.number().positive().max(100000),
  apenasMulheres: z.boolean().default(false),
  manualApproval: z.boolean().default(true),
  notes: z.string().trim().max(500).optional(),
});

export const tripSearchSchema = z.object({
  origem: z.string().trim().optional(),
  destino: z.string().trim().optional(),
  date: z.string().date().optional(),
  passengers: z.coerce.number().int().min(1).max(8).optional(),
  apenasMulheres: z.enum(['true', 'false']).optional(),
});

export const rideRequestSchema = z.object({
  seats: z.number().int().min(1).max(8).default(1),
});

export const ratingSchema = z.object({
  stars: z.number().int().min(1).max(5),
  subjectId: z.string().min(1),
  comment: z.string().trim().max(500).optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type TripSearchInput = z.infer<typeof tripSearchSchema>;
export type RideRequestInput = z.infer<typeof rideRequestSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
