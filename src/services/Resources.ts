import type {
  AccountType,
  AppointmentStatus,
  CaseStatus,
  Gender,
  Pronoun,
} from '~/generated/prisma/enums';

export type AccountResource = {
  id?: string;
  email: string;
  password?: string;
  type: AccountType;
  isVerified?: boolean;
};

// TODO: Split into AccountCreateResource and UserCreateResource
export type RegisterResource = {
  account: {
    email: string;
    password: string;
    type: AccountType;
  };
  entity: {
    firstname: string;
    lastname: string;
    title?: string;
    gender: Gender;
    genderText?: string;
    pronoun?: Pronoun;
    pronounText?: string;
    birthdate: Date;
    country?: string;
    city?: string;
    zipCode?: string;
    street?: string;
    houseNumber?: string;
    phone?: string;
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

export type UserLoginResource = {
  id: string;
  userId: string;
  type: AccountType;
  /** Expiration time in seconds since 1.1.1970 */
  exp: number;
};

export type EmployeeLoginResource = {
  id: string;
  employeeId: string;
  type: AccountType;
  /** Expiration time in seconds since 1.1.1970 */
  exp: number;
};

export type UserResource = {
  id: string;
  accountId: string;
  firstname: string;
  lastname: string;
  title?: string;
  gender: Gender;
  genderText?: string;
  pronoun?: Pronoun;
  pronounText?: string;
  birthdate: Date;
  phone?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  street?: string;
  houseNumber?: string;
  imageUrl?: string;
  placeOfBirth?: string;
};

export type EmployeeResource = {
  id: string;
  accountId: string;
  organizationId: string;
  firstname: string;
  lastname: string;
  title?: string;
  email: string;
  gender: Gender;
  genderText?: string;
  pronoun?: Pronoun;
  pronounText?: string;
  phone?: string;
  position?: string;
  languages: string[];
  expertiseAreas: string[];
  imageUrl?: string;
};
