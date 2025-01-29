export type Role = 'user' | 'admin' | 'manager';

export const Role = {
  USER: 'user' as Role,
  ADMIN: 'admin' as Role,
  MANAGER: 'manager' as Role,
} as const; 