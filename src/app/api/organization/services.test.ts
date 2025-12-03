import { jest } from '@jest/globals';

import { ValidationError } from '@/error/validationErrors';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

const mockHash = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockExecuteRaw = jest.fn();

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

  test('creates organization with hashed password and vector update', async () => {
    const input: OrganizationCreateInput = {
      name: 'Org',
      shortDescription: 'Short',
      email: 'org@example.com',
      password: 'supersecret',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseArea: ['Arbeitsrecht'],
    };

    mockFindUnique.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashed');
    mockCreate.mockResolvedValue({ ...input, id: 'org-1', password: 'hashed' });

    const org = await createOrganization(input);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'org@example.com' },
      select: { id: true },
    });
    expect(mockHash).toHaveBeenCalledWith('supersecret', 10);
    expect(mockCreate).toHaveBeenCalled();
    expect(mockExecuteRaw).toHaveBeenCalled();
    expect(org.id).toBe('org-1');
  });

  test('throws on missing required fields', async () => {
    const input = {
      email: 'org@example.com',
      password: 'supersecret',
      expertiseArea: ['Arbeitsrecht'],
    } as unknown as OrganizationCreateInput;

    await expect(createOrganization(input)).rejects.toBeInstanceOf(ValidationError);
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

  test('throws on duplicate email', async () => {
    mockFindUnique.mockResolvedValue({ id: 'existing' });

    const input: OrganizationCreateInput = {
      name: 'Org',
      shortDescription: 'Short',
      email: 'org@example.com',
      password: 'supersecret',
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

  test('readOrganizations throws on empty result', async () => {
    mockFindMany.mockResolvedValue([]);
    await expect(readOrganizations()).rejects.toBeInstanceOf(ValidationError);
  });
});
