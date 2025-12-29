import type { AccountType } from '~/generated/prisma/enums';

export type AccountResource = {
  id?: string;
  email: string;
  password?: string;
  type: AccountType;
};

export type RegisterResource = {
  account: {
    email: string;
    password: string;
    type: AccountType;
  };
  entity: {
    name: string;
    address: string;
    phone: string;
  };
};

export type LoginResource = {
  id: string;
  userId?: string;
  employeeId?: string;
  type: AccountType;
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
