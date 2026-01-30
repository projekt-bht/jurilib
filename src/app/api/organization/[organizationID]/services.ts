import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { createEmbedding } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Area } from '~/generated/prisma/client';

export const readOrganization = async (organizationID: string): Promise<Organization> => {
  try {
    const orga: Organization | null = await prisma.organization.findUnique({
      where: { id: organizationID },
    });
    if (!orga) {
      throw new ValidationError('notFound', 'organization', organizationID);
    }
    return orga;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateOrganization = async (
  organization: Organization,
  organizationID: string
): Promise<Organization> => {
  try {
    const existingOrg = await prisma.organization.findUnique({ where: { id: organizationID } });
    if (!existingOrg) {
      throw new ValidationError('notFound', 'organization', organizationID);
    }

    if (!organization.expertiseAreas) {
      throw new ValidationError('invalidInput', 'expertiseAreas', organization.expertiseAreas);
    }

    // Iterate through expertiseArea and validate each area
    organization.expertiseAreas.forEach((area) => {
      if (!Object.values(Area).includes(area)) {
        throw new ValidationError('invalidInput', 'expertiseArea', area);
      }
    });

    // Only re-vectorize if expertiseArea has changed
    // Spread operator "...organization" is used to copy all other fields of the organization
    if (existingOrg.expertiseAreas === organization.expertiseAreas) {
      const updatedOrganization = await prisma.organization.update({
        where: { id: organization.id },
        data: {
          ...organization,
        },
      });
      return updatedOrganization;
    } else {
      const expertiseVector = await createEmbedding(organization.expertiseAreas.toString());

      const updatedOrganization = await prisma.organization.update({
        where: { id: organization.id },
        data: {
          ...organization,
        },
      });

      await prisma.$executeRaw`UPDATE "Organization"
          SET "expertiseVector" = ${expertiseVector}::vector
          WHERE "id" = ${updatedOrganization.id}`;
      return updatedOrganization;
    }
  } catch (error) {
    // Hier muss geprüft werden, ob der Fehler von Prisma kommt oder von der Vektorisierung
    throw new Error('Database update failed or vectorization failed: ' + (error as Error).message);
  }
};

export const deleteOrganization = async (organizationID: string): Promise<void> => {
  try {
    await prisma.organization.delete({ where: { id: organizationID } });
  } catch (error) {
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
