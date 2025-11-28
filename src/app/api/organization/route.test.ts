import { NextRequest } from 'next/server';
import { POST, PATCH, GET } from '@/app/api/organization/route';
import { prisma } from '@/lib/db';
import { OrganizationCreateInput } from '~/generated/prisma/models';

jest.mock('@/services/server/vectorizer', () => ({
  vectorizeExpertiseArea: jest.fn(async () => Array(3072).fill(0.01)),
}));

describe('Organization Routen teset', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization`;

  test('POST Organizations', async () => {
    const organization: OrganizationCreateInput = {
      name: 'Max Mustermann Kanzlei',
      description: 'Kanzlei test',
      shortDescription: "Kanzlei shortTest",
      email: Math.random() + '@mail.de',
      password: "testpasswort",
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
      shortDescription: "Kanzlei shortTest",
      email: Math.random() + '@mail.de',
      password: "testpasswort",
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
