// Prepare mocking for sending emails and vectorizing - must be defined before importing the route handlers
import { jest } from '@jest/globals';

jest.unstable_mockModule('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  vectorizeExpertiseArea: jest.fn(async () => {
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
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account`;
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
  let createdAcc: Account;

  test('Setup: POST Account', async () => {
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

  test('Positive: GET Account', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: createdAcc.id }) });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.email).toBe(createdAcc.email);
  });

  test('Negative: GET Account with invalid UUID format', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ accountID: 'non-existing-id' }) });
    expect(res.status).toBe(400);
  });

  test('Positive: PATCH email', async () => {
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

  test('Negative: PATCH with invalid header content type', async () => {
    const account: Partial<AccountCreateInput> = {
      email: 'peter' + Math.random() + '@mail.de',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'text/html' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ accountID: createdAcc.id }),
    });

    expect(res.status).toBe(415);

    const updated = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });

    // Ensure email was not changed
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.email).not.toBe(account.email);
  });

  test('Negative: PATCH Account with invalid UUID format', async () => {
    const data: Partial<AccountCreateInput> = {
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

    // Ensure email was not changed
    expect(account?.email).toBe(createdAcc.email);
    expect(account?.email).not.toBe(data.email);
  });

  test('Negative: PATCH unchangeable Account Type', async () => {
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

    // Ensure neither email nor type was changed
    expect(updated?.email).not.toBe(account.email);
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.type).toBe(AccountType.USER);
  });

  test('Negative: PATCH invalid email format', async () => {
    const account: Partial<AccountCreateInput> = {
      email: 'this-is-not-a-valid-email.com',
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

    // Ensure email was not changed
    expect(updated?.email).not.toBe(account.email);
    expect(updated?.email).toBe(createdAcc.email);
  });

  test('Negative: PATCH invalid isVerified type', async () => {
    const account = {
      isVerified: 123,
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

    // Ensure isVerified was not changed
    expect(updated?.isVerified).toBe(createdAcc.isVerified);
  });

  test('Negative: PATCH password too short', async () => {
    const account: Partial<AccountCreateInput> = {
      password: '123',
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

    // Ensure password was not changed
    expect(updated?.password).toBe(createdAcc.password);
  });

  test('Negative: DELETE Account with invalid UUID', async () => {
    // make sure both Account and User exist before deletion
    const accountBefore = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    const userBefore = await prisma.user.findUnique({
      where: { accountId: createdAcc.id },
    });
    expect(accountBefore).not.toBeNull();
    expect(userBefore).not.toBeNull();

    // attempt to delete with invalid UUID
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });

    // verify both are still existing
    const accountAfter = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    const userAfter = await prisma.user.findUnique({
      where: { accountId: createdAcc.id },
    });
    expect(accountAfter).not.toBeNull();
    expect(userAfter).not.toBeNull();
    expect(res.status).toBe(400);
  });

  test('Negative: DELETE Account with non existing Account ID', async () => {
    // make sure Account with fake ID doesn't exist
    const fakeAccoutID = '00000000-4af3-4b8c-8601-000000000000';
    const fakeAccount = await prisma.account.findUnique({
      where: { id: fakeAccoutID },
    });
    expect(fakeAccount).toBeNull();

    // attempt to delete with non existing Account ID
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: fakeAccoutID }),
    });

    expect(res.status).toBe(404);
  });

  test('Positive: DELETE Account', async () => {
    // make sure both Account and User exist before deletion
    const accountBefore = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    const userBefore = await prisma.user.findUnique({
      where: { accountId: createdAcc.id },
    });
    expect(accountBefore).not.toBeNull();
    expect(userBefore).not.toBeNull();

    // delete Account and User
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ accountID: createdAcc.id }) });
    expect(res.status).toBe(200);
    const accountDeleted = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    const userDeleted = await prisma.user.findUnique({
      where: { accountId: createdAcc.id },
    });

    // verify both are deleted
    expect(res.status).toBe(200);
    expect(userDeleted).toBeNull();
    expect(accountDeleted).toBeNull();
  });
});
