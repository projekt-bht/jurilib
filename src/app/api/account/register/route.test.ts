import { jest } from '@jest/globals';

import type { AccountCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/account/register/route');

describe('Account Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;

  test('POST Account', async () => {
    const account: AccountCreateInput = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  test('POST Account with Invalid data', async () => {
    const account: AccountCreateInput = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '12',
      role: 'USER',
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
