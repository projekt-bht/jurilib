import { jest } from '@jest/globals';

import { ValidationError } from '@/error/validationErrors';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

const mockCreateOrganization = jest.fn() as jest.MockedFunction<
  (input: OrganizationCreateInput) => Promise<any>
>;
const mockReadOrganizations = jest.fn() as jest.MockedFunction<() => Promise<any[]>>;

jest.unstable_mockModule('./services', () => ({
  createOrganization: mockCreateOrganization,
  readOrganizations: mockReadOrganizations,
}));

const { POST, GET } = await import('./route');

describe('Organization route', () => {
  const baseUrl = 'http://localhost/api/organization';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST returns 201 and trims password from response', async () => {
    const organization: OrganizationCreateInput = {
      name: 'Org',
      shortDescription: 'Short',
      email: 'org@example.com',
      password: 'supersecret',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseArea: ['Arbeitsrecht'],
    };

    mockCreateOrganization.mockResolvedValue({
      ...organization,
      id: 'org-1',
      password: 'hashed',
    });

    const req = {
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => organization,
      url: baseUrl,
    } as any;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.organization).toEqual({
      id: 'org-1',
      name: 'Org',
      email: 'org@example.com',
    });
  });

  test('GET returns organizations', async () => {
    mockReadOrganizations.mockResolvedValue([
      { id: '1', name: 'Org', email: 'o@example.com', password: 'hashed' },
    ]);

    const req = { url: baseUrl } as any;
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveLength(1);
  });

  test('GET maps ValidationError to status code', async () => {
    mockReadOrganizations.mockRejectedValue(
      new ValidationError('notFound', 'organization', '', 404)
    );

    const req = { url: baseUrl } as any;
    const res = await GET(req);

    expect(res.status).toBe(404);
  });
});
