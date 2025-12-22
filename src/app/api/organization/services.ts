import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// Create a new organization
export const createOrganization = async (organization: Organization): Promise<Organization> => {
  try {
    console.log('ORG SERVICE - createOrganization called with:', organization);
    if (!organization.expertiseArea) {
      throw new Error('Expertise area is required');
    }

    // Iterate through expertiseArea and validate each area
    console.log('ORG SERVICE - Validating expertise areas:', organization.expertiseArea);
    organization.expertiseArea.forEach((area) => {
      if (!Object.values(Areas).includes(area)) {
        throw new Error(`Invalid expertise ${area} found!`);
      }
    });

    console.log('ORG SERVICE - All expertise areas are valid.');
    console.log('ORG SERVICE - Vectorizing expertise area:', organization.expertiseArea.toString());
    const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea.toString());

    console.log('ORG SERVICE - creating organization');
    const createdOrganization = await prisma.organization.create({
      data: organization as OrganizationCreateInput,
    });
    await prisma.$executeRaw`UPDATE "Organization"
            SET "expertiseVector" = ${expertiseVector}::vector
            WHERE "id" = ${createdOrganization.id}`;
    return createdOrganization;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

// Read all organizations
export const readOrganizations = async (): Promise<Organization[]> => {
  try {
    const orgas: Organization[] = await prisma.organization.findMany();
    if (!orgas) {
      throw new Error('Organization not found');
    }
    return orgas;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
