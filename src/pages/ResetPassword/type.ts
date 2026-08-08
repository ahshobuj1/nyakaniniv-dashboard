import {z} from 'zod';

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().min(4, 'OTP must be at least 4 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
