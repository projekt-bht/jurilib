import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

const ensureRequiredFields = (organization: OrganizationCreateInput) => {
  const requiredFields: Array<keyof OrganizationCreateInput | 'priceCategory'> = [
    'type',
    'name',
    'email',
    'password',
    'priceCategory',
  ];

  const missing = requiredFields.find((field) => !(organization as Record<string, unknown>)[field]);
  if (missing) {
    throw new ValidationError('invalidInput', missing, undefined, 400);
  }
};

const validateExpertiseArea = (expertiseArea?: OrganizationCreateInput['expertiseArea']) => {
  if (!expertiseArea || expertiseArea.length === 0) {
    throw new ValidationError('invalidInput', 'expertiseArea', expertiseArea, 400);
  }

  const invalidArea = expertiseArea.find((area) => !Object.values(Areas).includes(area as Areas));
  if (invalidArea) {
    throw new ValidationError('invalidInput', 'expertiseArea', invalidArea, 400);
  }
};

// Create a new organization
export const createOrganization = async (
  organization: OrganizationCreateInput
): Promise<Organization> => {
  ensureRequiredFields(organization);
  validateExpertiseArea(organization.expertiseArea);

  if (!organization.password || organization.password.length < 8) {
    throw new ValidationError('invalidInput', 'password', organization.password, 400);
  }

  const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea!.toString());
  const hashedPassword = await bcrypt.hash(organization.password, 10);

  const createdOrganization = await prisma.organization.create({
    data: {
      ...organization,
      password: hashedPassword,
    },
  });

  await prisma.$executeRaw`UPDATE "Organization"
          SET "expertiseVector" = ${expertiseVector}::vector
          WHERE "id" = ${createdOrganization.id}`;

  return createdOrganization;
};

// Read all organizations
export const readOrganizations = async (): Promise<Organization[]> => {
  const orgas: Organization[] = await prisma.organization.findMany();
  if (!orgas || orgas.length === 0) {
    throw new ValidationError('notFound', 'organization', undefined, 404);
  }
  return orgas;
};
