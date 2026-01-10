import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization, Prisma } from '~/generated/prisma/client';
import { Areas, OrganizationType, PriceCategory } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// Create a new organization
export const createOrganization = async (organization: Organization): Promise<Organization> => {
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
};

// Read all organizations
// Fetch organizations with optional filter arrays coming from the UI query params.
// Each filter narrows the result set, and omitted/empty filters are ignored.
export const readOrganizations = async (filters?: {
  priceCategory?: PriceCategory[];
  organizationType?: OrganizationType[];
  specialties?: Areas[];
}): Promise<Organization[]> => {
  try {
    // Build a Prisma where clause that mirrors the UI filter selections.
    const where: Prisma.OrganizationWhereInput = {};
    if (filters?.priceCategory?.length) {
      where.priceCategory = { in: filters.priceCategory };
    }
    if (filters?.organizationType?.length) {
      where.type = { in: filters.organizationType };
    }
    if (filters?.specialties?.length) {
      where.expertiseArea = { hasSome: filters.specialties };
    }

    const orgas: Organization[] = await prisma.organization.findMany({ where });
    if (!orgas) {
      throw new Error('Organization not found');
    }
    return orgas;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
