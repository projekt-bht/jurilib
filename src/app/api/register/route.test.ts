import { jest } from '@jest/globals';

import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/register/route');

describe('Account Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/register`;

  test('POST Register User', async () => {
    const account: AccountCreateInput = {
      email: 'PETER_USER' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
    };

    const user: UserCreateInput = {
      name: 'PETER_USER',
      account: {
        connect: undefined, // Wird später gesetzt (user Service),
      },
    };

    const struct = {
      account: account,
      entity: user,
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(struct),
    });

    const res = await POST(req);
    expect(res!.status).toBe(201);
  });
});
