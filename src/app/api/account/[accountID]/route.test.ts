import { jest } from '@jest/globals';

import type { Account } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH, DELETE } = await import('@/app/api/account/[accountID]/route');
const { POST } = await import('@/app/api/account/route');

describe('Account Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;
  let createdAcc: Account;

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
    createdAcc = await res.json();
  });

  test('GET Account', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('GET non-existing Account', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: 'non-existing-id' }) });
    expect(res.status).toBe(404);
  });

  test('PATCH Account Role', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const account: AccountCreateInput = {
      id: createdAcc.id,
      email: 'peter' + Math.random() + '@mail.de',
      password: '5555555',
      role: 'EMPLOYEE',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: createdAcc.id }),
    });

    const updated = await prisma.account.findFirst({
      where: { email: account.email },
    });

    expect(updated?.role).toBe('EMPLOYEE');
    expect(res.status).toBe(200);
  });

  test('PATCH Account with invalid data', async () => {
    const data = {
      id: '123456',
    };
    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: createdAcc.id }),
    });
    expect(res.status).toBe(400);
  });

  test('DELETE Account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    expect(res.status).toBe(200);
  });

  test('DELETE non-existing Account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });
    expect(res.status).toBe(400);
  });
});
