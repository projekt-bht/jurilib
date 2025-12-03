import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

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
  validateExpertiseArea(organization.expertiseArea);

  const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea!.toString());

  const createdOrganization = await prisma.organization.create({
    data: organization,
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
