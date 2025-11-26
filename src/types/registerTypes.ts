import type { Areas, OrganizationType } from '~/generated/prisma/enums';

export type TabType = 'user' | 'organization';

export type UserFormState = {
  name: string;
  email: string;
  password: string;
};

export type OrganizationFormState = {
  contactName: string;
  contactEmail: string;
  password: string;
  organizationName: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  organizationType: OrganizationType;
  expertiseArea: Areas[];
};

export type SubmissionState =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };
