import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

export const readOrganization = async (organizationID: string): Promise<Organization> => {
  try {
    const orga: Organization | null = await prisma.organization.findUnique({
      where: { id: organizationID },
    });
    if (!orga) {
      throw new ValidationError('notFound', 'organizationID', organizationID, 404);
    }
    return orga;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateOrganization = async (
  organization: OrganizationCreateInput,
  organizationID: string
): Promise<Organization> => {
  try {
    const existingOrg = await prisma.organization.findUnique({ where: { id: organizationID } });
    if (!existingOrg) {
      throw new ValidationError('notFound', 'organizationID', organizationID, 404);
    }

    const expertiseArea = Array.isArray(organization.expertiseArea)
      ? organization.expertiseArea
      : undefined;

    if (!expertiseArea) {
      throw new ValidationError('invalidInput', 'expertiseArea', organization.expertiseArea, 400);
    }

    // Iterate through expertiseArea and validate each area
    expertiseArea.forEach((area) => {
      if (!Object.values(Areas).includes(area)) {
        throw new ValidationError('invalidInput', 'expertiseArea', area, 400);
      }
    });

    // Only re-vectorize if expertiseArea has changed
    // Spread operator "...organization" is used to copy all other fields of the organization
    const data = { ...organization, expertiseArea };
    if (organization.password) {
      // Rehash incoming password when it is being changed
      data.password = await bcrypt.hash(organization.password, 10);
    }

    if (existingOrg.expertiseArea === expertiseArea) {
      const updatedOrganization = await prisma.organization.update({
        where: { id: organization.id },
        data: {
          ...data,
        },
      });
      return updatedOrganization;
    } else {
      const expertiseVector = await vectorizeExpertiseArea(expertiseArea.join(', '));

      const updatedOrganization = await prisma.organization.update({
        where: { id: organization.id },
        data: {
          ...data,
        },
      });

      await prisma.$executeRaw`UPDATE "Organization"
          SET "expertiseVector" = ${expertiseVector}::vector
          WHERE "id" = ${updatedOrganization.id}`;
      return updatedOrganization;
    }
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error('Database update failed or vectorization failed: ' + (error as Error).message);
  }
};

export const deleteOrganization = async (organizationID: string): Promise<void> => {
  try {
    const existing = await prisma.organization.findUnique({ where: { id: organizationID } });
    if (!existing) {
      throw new ValidationError('notFound', 'organizationID', organizationID, 404);
    }

    await prisma.organization.delete({ where: { id: organizationID } });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
