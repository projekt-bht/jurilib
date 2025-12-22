import { jest } from '@jest/globals';

import type { Account } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH, DELETE } = await import('@/app/api/account/[accountID]/route');
const { POST } = await import('@/app/api/authentication/register/route');

describe('Account Routen testen', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;
  let createdAcc: Account;

  test('POST Account', async () => {
    const account = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
      name: 'Peter Mustermann',
    };

    const req = new NextRequest(baseUrlRegister, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });

    console.log('Test 1: programm läuft noch');

    const res = await POST(req);
    expect(res.status).toBe(201);
    const result = await prisma.account.findUnique({
      where: { email: account.email },
    });
    expect(result).not.toBeNull();
    console.log('Created Account in DB:', result);
    createdAcc = result as Account;
    console.log('Created Account:', createdAcc);
  });

  test('GET Account', async () => {
    console.log('Test ##11: programm läuft noch');
    const req = new NextRequest(baseUrl);
    console.log('Test ##12: programm läuft noch');
    console.log('Account ID for GET:', createdAcc.id);
    const res = await GET(req, { params: Promise.resolve({ accountID: createdAcc.id }) });
    console.log('Test ##13: programm läuft noch');
    const json = await res.json();
    console.log('Test ##14: programm läuft noch');
    console.log('Response JSON:', json);
    expect(json.email).toBe(createdAcc.email);
    console.log('Email Old:', createdAcc.email);
    console.log('Email New:', json.email);
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

    expect(updated?.email).toBe(account.email);
    expect(updated?.role).toBe('USER'); // Role should remain unchanged
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
    console.log('Test ???1: programm läuft noch');
    const getReq = new NextRequest(baseUrl);
    console.log('Test ???2: programm läuft noch');
    console.log('TEST: Account ID to delete:', createdAcc.id);
    const account = await prisma.account.findUnique({
      where: { id: createdAcc.id },
      //select: { role: true },
    });
    console.log('TEST: Account fetched for deletion:', account);
    const res = await DELETE(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    console.log('Test ???3: programm läuft noch');
    console.log('RESULT: ', res.body);
    const jsonResponse = await res.json();
    console.log('Response Message:', jsonResponse.message);
    expect(res.status).toBe(200);
  });

  test('DELETE non-existing Account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });
    expect(res.status).toBe(404);
  });
});
