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
