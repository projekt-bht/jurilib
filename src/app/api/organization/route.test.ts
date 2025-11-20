import { NextRequest } from 'next/server';

import { GET } from '@/app/api/organization/route';

jest.mock('@/services/openRouter/vectorizer', () => ({
  vectorizeExpertiseArea: jest.fn(async () => Array(3072).fill(0.01)),
}));

describe('Organization Routen teset', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization`;

  test('GET Organizations', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
