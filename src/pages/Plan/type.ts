import {z} from 'zod';

export interface IPlan {
  id: number;
  name: string;
  priceMonthly: string | number; // Decimal in prisma maps to string or number depending on backend json serialization
  priceAnnually: string | number;
  stripeAnnualPriceId: string;
  discountPercentage: number;
  isActive: boolean;
  features: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const FEATURE_KEYS = [
  'MAX_EVENTS',
  'BASIC_PROFILE',
  'MANUAL_BOOKINGS',
  'CUSTOM_SUBDOMAIN',
  'BASIC_ANALYTICS',
  'MULTIPLE_THEMES',
  'ONLINE_PAYMENTS',
  'AUTOMATED_INVOICING',
  'EMAIL_NOTIFICATIONS',
  'CUSTOM_DOMAIN',
  'REMOVE_BRANDING',
  'PRIORITY_SUPPORT',
  'ADVANCED_ANALYTICS',
] as const;

export const PlanFeaturesSchema = z.object({
  MAX_EVENTS: z.coerce.number().default(-1),
  BASIC_PROFILE: z.boolean().default(false),
  MANUAL_BOOKINGS: z.boolean().default(false),
  CUSTOM_SUBDOMAIN: z.boolean().default(false),
  BASIC_ANALYTICS: z.boolean().default(false),
  MULTIPLE_THEMES: z.boolean().default(false),
  ONLINE_PAYMENTS: z.boolean().default(false),
  AUTOMATED_INVOICING: z.boolean().default(false),
  EMAIL_NOTIFICATIONS: z.boolean().default(false),
  CUSTOM_DOMAIN: z.boolean().default(false),
  REMOVE_BRANDING: z.boolean().default(false),
  PRIORITY_SUPPORT: z.boolean().default(false),
  ADVANCED_ANALYTICS: z.boolean().default(false),
});

export const PlanCreateSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  priceMonthly: z.coerce.number().min(0, 'Monthly price must be positive'),
  priceAnnually: z.coerce.number().min(0, 'Annual price must be positive'),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  features: PlanFeaturesSchema.default({} as any),
});

export type PlanCreateType = z.infer<typeof PlanCreateSchema>;

export const editPlanSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Plan name is required'),
  priceMonthly: z.coerce.number().min(0, 'Monthly price must be positive'),
  priceAnnually: z.coerce.number().min(0, 'Annual price must be positive'),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  features: PlanFeaturesSchema.default({} as any),
});

export type EditPlanInput = z.infer<typeof editPlanSchema>;

