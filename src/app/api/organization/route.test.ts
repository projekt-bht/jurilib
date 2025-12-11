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

// Dynamisch die API-Funktionen importieren
const { GET, POST } = await import('@/app/api/organization/route');

describe('Organization Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization`;

  test('POST Organizations', async () => {
    const organization: OrganizationCreateInput = {
      name: 'Max Mustermann Kanzlei',
      description: 'Kanzlei test',
      shortDescription: 'Kanzlei shortTest',
      email: Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseArea: ['Verkehrsrecht', 'Transport- & Speditionsrecht'],
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organization),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  test('GET Organizations', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
