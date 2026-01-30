// Prepare mocking for sending emails and vectorizing - must be defined before importing the route handlers
import { jest } from '@jest/globals';

jest.unstable_mockModule('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  createEmbedding: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Non-mock related implementation:

import type { OrganizationCreateInput, OrganizationUpdateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { DELETE, GET, PATCH } = await import('@/app/api/organization/[organizationID]/route');
const { POST } = await import('@/app/api/organization/route');

describe('Organization Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization/[organizationID]`;
  let createdOrgId: string;

  // Usage of POST from organization/route.ts to create an organization for further tests
  test('POST Organization', async () => {
    const organization: OrganizationCreateInput = {
      name: 'Max Mustermann Kanzlei',
      description: 'Kanzlei test',
      email: Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      expertiseAreas: ['Verkehrsrecht', 'Arbeitsrecht'],
      shortDescription: '',
      priceCategory: 'FREE',
      country: 'Deutschland',
      city: 'Berlin',
      zipCode: '10115',
      street: 'Musterstraße',
      houseNumber: '1A',

      averageRating: 4.5,
      numberOfRatings: 10,
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(organization),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    createdOrgId = (await res.json()).id;
  });

  test('GET Organization', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ organizationID: createdOrgId }) });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('GET non-existing Organization', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ organizationID: 'non-existing-id' }) });
    expect(res.status).toBe(404);
  });

  test('PATCH Organization', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ organizationID: createdOrgId }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const organization: OrganizationUpdateInput = {
      id: getJSON.id,
      name: 'updated',
      description: 'Kanzlei test',
      email: Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      expertiseAreas: ['Verkehrsrecht', 'Arbeitsrecht'],
      shortDescription: '',
      priceCategory: 'FREE',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(organization),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ organizationID: createdOrgId }),
    });

    const updated = await prisma.organization.findFirst({
      where: { name: 'updated' },
    });

    expect(updated?.name).toBe('updated');
    expect(res.status).toBe(200);
  });

  test('PATCH Organization with invalid data', async () => {
    const data = {
      id: '123456',
    };
    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ organizationID: createdOrgId }),
    });
    expect(res.status).toBe(400);
  });

  test('DELETE Organization', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ organizationID: createdOrgId }) });
    expect(res.status).toBe(200);
  });

  test('DELETE non-existing Organization', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ organizationID: 'non-existing-id' }),
    });
    expect(res.status).toBe(400);
  });
});
