import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// Create a new organization
export async function createOrganization(organization: Organization): Promise<Organization> {
  try {
    if (!organization.expertiseArea) {
      throw new Error('Expertise area is required');
    }

    // Iterate through expertiseArea and validate each area
    organization.expertiseArea.forEach((area) => {
      if (!Object.values(Areas).includes(area)) {
        throw new Error(`Invalid expertise ${area} found!`);
      }
    });

    const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea.toString());

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
}

// Read all organizations
export async function readOrganizations(filters: {
  skip: number;
  take: number;
}): Promise<Organization[]> {
  try {
    if (!Number.isInteger(filters.skip) || filters.skip! < 0) {
      throw new Error(`'skip' Query Parameter needs to be provided`);
    }
    if (!Number.isInteger(filters.take) || filters.take! <= 0) {
      throw new Error(`'take' Query Parameter needs to be provided`);
    }
    const orgas: Organization[] = await prisma.organization.findMany({
      skip: filters.skip,
      take: filters.take,
    });
    if (!orgas) {
      throw new Error('Organization not found');
    }
    return orgas;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
}
