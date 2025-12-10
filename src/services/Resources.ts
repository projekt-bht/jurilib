import type { Role } from '~/generated/prisma/enums';

export type AccountResource = {
  id?: string;
  email: string;
  password?: string;
  role: Role;
};

export type RegisterRessource = {
  account: {
    email: string;
    password: string;
    role: Role;
  };
  entity: {
    name: string;
    address: string;
    phone: string;
  };
};

export type LoginResource = {
  id: string;
  role: Role;
  /** Expiration time in seconds since 1.1.1970 */
  exp: number;
};
