import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// Validate that all mandatory properties exist before we hit the database.
const ensureRequiredFields = (organization: OrganizationCreateInput) => {
  const requiredFields: Array<keyof OrganizationCreateInput | 'priceCategory'> = [
    'type',
    'name',
    'shortDescription',
    'email',
    'password',
    'priceCategory',
  ];

  const missing = requiredFields.find((field) => !(organization as Record<string, unknown>)[field]);
  if (missing) {
    throw new ValidationError('invalidInput', missing, undefined, 400);
  }
};

// Normalize the expertise area payload into a plain array and fail fast on bad input.
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
// Main creation flow for organizations. Handles validation, deduping, hashing, optional vectorization and persistence.
export const createOrganization = async (
  organization: OrganizationCreateInput
): Promise<Organization> => {
  ensureRequiredFields(organization);
  const expertiseArea = normalizeExpertiseArea(organization.expertiseArea);

  // Enforce password strength on the API level.
  if (!organization.password || organization.password.length < 8) {
    throw new ValidationError('invalidInput', 'password', organization.password, 400);
  }

  // Prevent duplicate signups by e-mail.
  const existingOrg = await prisma.organization.findUnique({
    where: { email: organization.email },
    select: { id: true },
  });
  if (existingOrg) {
    throw new ValidationError('duplicate', 'email', organization.email, 400);
  }

  // Best-effort embedding generation: do not block creation if OpenAI credentials are missing.
  let expertiseVector: string | null = null;
  try {
    // Still create the organization even if embeddings fail (e.g., no API key) to avoid blocking signups
    expertiseVector = await vectorizeExpertiseArea(expertiseArea.toString());
  } catch (error) {
    console.warn('Vectorization skipped:', (error as Error).message);
  }

  // Hash password before storing.
  const hashedPassword = await bcrypt.hash(organization.password, 10);

  // Persist the core organization record with normalized expertise array.
  const createdOrganization = await prisma.organization.create({
    data: {
      ...organization,
      password: hashedPassword,
      expertiseArea,
    },
  });

  // Populate the vector column only when we have an embedding.
  if (expertiseVector) {
    await prisma.$executeRaw`UPDATE "Organization"
            SET "expertiseVector" = ${expertiseVector}::vector
            WHERE "id" = ${createdOrganization.id}`;
  }

  return createdOrganization;
};

// Read all organizations
export const readOrganizations = async (): Promise<Organization[]> => {
  // Simple read with 404-style error if none exist.
  const orgas: Organization[] = await prisma.organization.findMany();
  if (!orgas || orgas.length === 0) {
    throw new ValidationError('notFound', 'organization', undefined, 404);
  }
  return orgas;
};
