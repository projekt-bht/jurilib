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
    // firstname: string;
    // lastname: string;
    // title?: string;
    // gender: Gender
    // genderText?: string;
    // pronoun: Pronoun
    // pronounText?: string;
    // brithdate: Date;
    address: string;
    // country: string;
    // city: string;
    // zipCode: string;
    // street: string;
    // houseNumber: string;
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
  // firstname: string;
  // lastname: string;
  // title?: string;
  // gender: Gender
  // genderText?: string;
  // pronoun: Pronoun
  // pronounText?: string;
  // brithdate: Date;
  address?: string;
  phone?: string;
  // country: string;
  // city: string;
  // zipCode: string;
  // street: string;
  // houseNumber: string;
};
