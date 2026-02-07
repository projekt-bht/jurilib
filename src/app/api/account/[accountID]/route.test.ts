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
import type { RegisterResource } from '@/services/Resources';
import { type Account, AccountType, Gender, Pronoun } from '~/generated/prisma/client';
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
    const registerInput: RegisterResource = {
      account: {
        email: 'peter' + Math.random() + '@mail.de',
        password: '1234567890',
        type: AccountType.USER,
      },
      entity: {
        firstname: 'Peter',
        lastname: 'Mustermann',
        gender: Gender.Mann,
        pronoun: Pronoun.er_ihm,
        birthdate: new Date('1990-01-01'),
      },
    };

    const req = new NextRequest(baseUrlRegister, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const res = await POST(req);
    expect(res!.status).toBe(201);
    const result = await prisma.account.findUnique({
      where: { email: registerInput.account.email },
    });
    expect(result).not.toBeNull();
    createdAcc = result as Account;
  });

  test('GET Account', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.email).toBe(createdAcc.email);
  });

  test('GET non-existing Account', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: 'non-existing-id' }) });
    expect(res.status).toBe(400);
  });

  test('PATCH email', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const account: Partial<AccountCreateInput> = {
      email: 'peter' + Math.random() + '@mail.de',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: createdAcc.id }),
    });

    const updated = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });

    expect(updated?.email).toBe(account.email);
    expect(res.status).toBe(200);

    // Save new email for further tests
    createdAcc.email = updated?.email ?? createdAcc.email;
  });

  test('PATCH unchangeable Account Type', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const account: Partial<AccountCreateInput> = {
      email: 'peter' + Math.random() + '@mail.de',
      type: AccountType.EMPLOYEE,
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: createdAcc.id }),
    });

    const updated = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });

    expect(res.status).toBe(400);
    expect(updated?.email).not.toBe(account.email);
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.type).toBe(AccountType.USER); // Type should remain unchanged
  });

  test('PATCH Account with invalid data', async () => {
    const data = {
      email: 'peter' + Math.random() + '@mail.de',
    };
    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: '7453959384' }),
    });

    const account = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });

    expect(res.status).toBe(400);
    expect(account?.email).toBe(createdAcc.email);
  });

  test('DELETE Account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    expect(res.status).toBe(200);
    const accountDeleted = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    expect(accountDeleted).toBeNull();
  });

  test('DELETE non-existing Account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });
    expect(res.status).toBe(400);
  });
});
