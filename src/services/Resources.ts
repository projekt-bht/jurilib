import type { Role } from '~/generated/prisma/enums';

export type AccountResource = {
  id?: string;
  email: string;
  password?: string;
  role: Role;
};

export type RegisterResource = {
  email: string;
  password: string;
  role: Role;

  name: string;
  address: string;
  phone: string;
};

export type LoginResource = {
  id: string;
  userId?: string;
  employeeId?: string;
  role: Role;
  /** Expiration time in seconds since 1.1.1970 */
  exp: number;
};

export type UserResource = {
  id: string;
  accountId: string;
  name: string;
  address?: string;
  phone?: string;
};
