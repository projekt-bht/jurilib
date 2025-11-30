import { jest } from '@jest/globals';

import type { OrganizationCreateInput } from '~/generated/prisma/models';

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
const { GET, PATCH, POST } = await import('@/app/api/organization/route');

describe('Organization Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization`;

  test('POST Organizations', async () => {
    const organization: OrganizationCreateInput = {
      name: 'Max Mustermann Kanzlei',
      description: 'Kanzlei test',
      shortDescription: 'Kanzlei shortTest',
      email: Math.random() + '@mail.de',
      password: 'testpasswort',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      body: JSON.stringify(organization),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  test('PATCH Organizations', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq);
    const getJSON = await getRes.json();

    const organization: OrganizationCreateInput = {
      id: getJSON[0].id,
      name: 'updated',
      description: 'Kanzlei test',
      shortDescription: 'Kanzlei shortTest',
      email: Math.random() + '@mail.de',
      password: 'testpasswort',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
    };

    const patchReq = new NextRequest(baseUrl, {
      method: 'PATCH',
      body: JSON.stringify(organization),
    });

    const res = await PATCH(patchReq);

    const updated = await prisma.organization.findFirst({
      where: { name: 'updated' },
    });

    expect(updated?.name).toBe('updated');
    expect(res.status).toBe(200);
  });

  test('GET Organizations', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
