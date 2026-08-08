import {z} from 'zod';

export interface IPlan {
  id: number;
  name: string;
  priceMonthly: string | number; // Decimal in prisma maps to string or number depending on backend json serialization
  priceAnnually: string | number;
  discountPercentage?: number;
  features: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const PlanCreateSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  priceMonthly: z.coerce.number().min(0, 'Monthly price must be positive'),
  priceAnnually: z.coerce.number().min(0, 'Annual price must be positive'),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  features: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      valueType: z.enum(['boolean', 'number', 'string']),
      valueBoolean: z.boolean().optional(),
      valueNumber: z.coerce.number().optional(),
      valueString: z.string().optional(),
    })
  ).default([]),
});

export type PlanCreateType = z.infer<typeof PlanCreateSchema>;

export const editPlanSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Plan name is required'),
  priceMonthly: z.coerce.number().min(0, 'Monthly price must be positive'),
  priceAnnually: z.coerce.number().min(0, 'Annual price must be positive'),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  features: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      valueType: z.enum(['boolean', 'number', 'string']),
      valueBoolean: z.boolean().optional(),
      valueNumber: z.coerce.number().optional(),
      valueString: z.string().optional(),
    })
  ).default([]),
});

export type EditPlanInput = z.infer<typeof editPlanSchema>;

