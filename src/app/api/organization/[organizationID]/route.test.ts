import { jest } from '@jest/globals';

import type { OrganizationCreateInput } from '~/generated/prisma/models';

import { POST } from '../route';

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  vectorizeExpertiseArea: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { DELETE, GET, PATCH } = await import('@/app/api/organization/[organizationID]/route');

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
      expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
      shortDescription: '',
      password: '',
      priceCategory: 'FREE',
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

    const organization: OrganizationCreateInput = {
      id: getJSON.id,
      name: 'updated',
      description: 'Kanzlei test',
      email: Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
      shortDescription: '',
      password: '',
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
