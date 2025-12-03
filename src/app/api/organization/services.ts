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

const normalizeExpertiseArea = (expertiseArea?: OrganizationCreateInput['expertiseArea']) => {
  const arr = Array.isArray(expertiseArea)
    ? expertiseArea
    : expertiseArea && 'set' in expertiseArea
      ? (expertiseArea.set as Areas[])
      : [];

  if (arr.length === 0) {
    throw new ValidationError('invalidInput', 'expertiseArea', expertiseArea, 400);
  }

  const invalidArea = arr.find((area) => !Object.values(Areas).includes(area as Areas));
  if (invalidArea) {
    throw new ValidationError('invalidInput', 'expertiseArea', invalidArea, 400);
  }

  return arr;
};

// Create a new organization
export const createOrganization = async (
  organization: OrganizationCreateInput
): Promise<Organization> => {
  ensureRequiredFields(organization);
  const expertiseArea = normalizeExpertiseArea(organization.expertiseArea);

  if (!organization.password || organization.password.length < 8) {
    throw new ValidationError('invalidInput', 'password', organization.password, 400);
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { email: organization.email },
    select: { id: true },
  });
  if (existingOrg) {
    throw new ValidationError('duplicate', 'email', organization.email, 400);
  }

  const expertiseVector = await vectorizeExpertiseArea(expertiseArea.toString());
  const hashedPassword = await bcrypt.hash(organization.password, 10);

  const createdOrganization = await prisma.organization.create({
    data: {
      ...organization,
      password: hashedPassword,
      expertiseArea,
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
