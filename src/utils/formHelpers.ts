import { Areas, OrganizationType } from '~/generated/prisma/enums';

import type { OrganizationFormState, UserFormState } from '@/types/registerTypes';

const baseUserState: UserFormState = {
  name: '',
  email: '',
  password: '',
};

const baseOrganizationState: OrganizationFormState = {
  contactName: '',
  contactEmail: '',
  password: '',
  organizationName: '',
  phone: '',
  website: '',
  address: '',
  description: '',
  organizationType: OrganizationType.LAW_FIRM,
  expertiseArea: [],
};

export const AREA_OPTIONS = Object.values(Areas);
export const ORGANIZATION_TYPES = Object.values(OrganizationType);

/**
 * Returns a deep copy of the initial user form state so multiple forms do not
 * share references.
 */
export const getUserFormInitialState = (): UserFormState => ({
  ...baseUserState,
});

/**
 * Returns a deep copy of the organization initial state, ensuring nested
 * arrays (expertise areas) are unique per form instance.
 */
export const getOrganizationFormInitialState = (): OrganizationFormState => ({
  ...baseOrganizationState,
  expertiseArea: [...baseOrganizationState.expertiseArea],
});

/**
 * Checks whether the current form data deviates from the initial values. We
 * serialize to JSON so nested values are compared reliably without writing
 * custom comparison logic for each field.
 */
export const hasFormChanged = <T>(initialState: T, currentState: T): boolean =>
  JSON.stringify(initialState) !== JSON.stringify(currentState);
