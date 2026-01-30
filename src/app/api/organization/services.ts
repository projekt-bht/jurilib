import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type {
  Accessibility,
  Language,
  Organization,
  OrganizationType,
  PriceCategory,
  Prisma,
} from '~/generated/prisma/client';
import { Area } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// Create a new organization
export async function createOrganization(organization: Organization): Promise<Organization> {
  try {
    if (!organization.expertiseAreas) {
      throw new ValidationError('invalidInput', 'expertiseAreas', organization.expertiseAreas);
    }

    // Iterate through expertiseArea and validate each area
    organization.expertiseAreas.forEach((area) => {
      if (!Object.values(Area).includes(area)) {
        throw new ValidationError('invalidInput', 'expertiseArea', area);
      }
    });

    const expertiseVector = await vectorizeExpertiseArea(organization.expertiseAreas.toString());

    const createdOrganization = await prisma.organization.create({
      data: organization as OrganizationCreateInput,
    });
    await prisma.$executeRaw`UPDATE "Organization"
            SET "expertiseVector" = ${expertiseVector}::vector
            WHERE "id" = ${createdOrganization.id}`;
    return createdOrganization;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

// Read all organizations
// Fetch organizations with optional filter arrays coming from the UI query params.
// Each filter narrows the result set, and omitted/empty filters are ignored.
export async function readOrganizations(filters: {
  skip: number;
  take: number;
  priceCategory?: PriceCategory[];
  organizationType?: OrganizationType[];
  area?: Area[];
  languages?: Language[];
  accessibility?: Accessibility[];
}): Promise<Organization[]> {
  try {
    // Build a Prisma where clause that mirrors the UI filter selections.
    const where: Prisma.OrganizationWhereInput = {};
    if (filters?.priceCategory?.length) {
      where.priceCategory = { in: filters.priceCategory };
    }
    if (filters?.organizationType?.length) {
      where.type = { in: filters.organizationType };
    }
    if (filters?.area?.length) {
      where.expertiseAreas = { hasSome: filters.area };
    }
    if (filters?.languages?.length) {
      where.employees = { some: { languages: { hasSome: filters.languages } } };
    }
    if (filters?.accessibility?.length) {
      where.accessibility = { hasSome: filters.accessibility };
    }

    const orgas: Organization[] = await prisma.organization.findMany({
      skip: filters.skip,
      take: filters.take,
      where,
    });
    if (!orgas) {
      throw new ValidationError('notFound', 'organization', null, 404);
    }
    return orgas;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database query failed: ' + (error as Error).message);
  }
}
