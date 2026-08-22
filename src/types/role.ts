export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  DJ: 'DJ',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
