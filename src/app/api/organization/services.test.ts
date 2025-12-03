import { jest } from '@jest/globals';

import { ValidationError } from '@/error/validationErrors';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

const mockHash: jest.Mock = jest.fn();
const mockFindUnique: jest.Mock = jest.fn();
const mockCreate: jest.Mock = jest.fn();
const mockFindMany: jest.Mock = jest.fn();
const mockExecuteRaw: jest.Mock = jest.fn();

jest.unstable_mockModule('bcryptjs', () => ({
  default: { hash: mockHash },
}));

jest.unstable_mockModule('@/lib/db', () => {
  const mockPrisma = {
    organization: {
      findUnique: mockFindUnique,
      create: mockCreate,
      findMany: mockFindMany,
    },
    $executeRaw: mockExecuteRaw,
  };
  return { default: mockPrisma, prisma: mockPrisma };
});

jest.unstable_mockModule('@/services/server/vectorizer', () => ({
  vectorizeExpertiseArea: jest.fn(async () => '[0.1,0.2]'),
}));

const { createOrganization, readOrganizations } = await import('./services');

describe('organization services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws on missing required fields', async () => {
    const input = {
      email: 'org@example.com',
      password: 'supersecret',
      expertiseArea: ['Arbeitsrecht'],
    } as unknown as OrganizationCreateInput;

    await expect(createOrganization(input)).rejects.toBeInstanceOf(ValidationError);
  });
});

test('throws on short password', async () => {
  const input: OrganizationCreateInput = {
    name: 'Org',
    shortDescription: 'Short',
    email: 'org@example.com',
    password: 'short',
    type: 'LAW_FIRM',
    priceCategory: 'FREE',
    expertiseArea: ['Arbeitsrecht'],
  };

  await expect(createOrganization(input)).rejects.toBeInstanceOf(ValidationError);
});

test('throws on invalid expertise area', async () => {
  const input: OrganizationCreateInput = {
    name: 'Org',
    shortDescription: 'Short',
    email: 'org@example.com',
    password: 'supersecret',
    type: 'LAW_FIRM',
    priceCategory: 'FREE',
    expertiseArea: ['InvalidArea' as any],
  };

  await expect(createOrganization(input)).rejects.toBeInstanceOf(ValidationError);
});
