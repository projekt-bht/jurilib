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
import bcrypt from 'bcryptjs';

import type { RegisterResource } from '@/services/Resources';
import type { Account } from '~/generated/prisma/browser';
import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH } = await import('@/app/api/account/route');
const registerRoute = await import('@/app/api/authentication/register/route');
const RegisterPOST = registerRoute.POST;

describe('Account Routen testen', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
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

    const res = await RegisterPOST(req);
    expect(res!.status).toBe(201);
    const result = await prisma.account.findUnique({
      where: { email: registerInput.account.email },
    });
    expect(result).not.toBeNull();
    createdAcc = result as Account;
  });

  test('Positive: GET Accounts', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('Positive: PATCH Account by email', async () => {
    const account: Partial<AccountCreateInput> = {
      email: createdAcc.email,
      password: 'newSecurePassword' + Math.random() + '!',
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(req);

    const updated = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(res.status).toBe(200);

    expect(updated).not.toBeNull();
    expect(updated?.email).toBe(account.email);
    expect(updated?.id).toBe(createdAcc.id);

    expect(await bcrypt.compare(account.password!, updated!.password)).toBe(true);
    expect(updated?.password).not.toBe(account.password); // password should be hashed

    // Save new password for further tests
    createdAcc.password = updated?.password ?? createdAcc.password;
  });

  test('Negative: PATCH invalid header content-type', async () => {
    const account: Partial<AccountCreateInput> = {
      email: createdAcc.email,
      password: 'newSecurePassword' + Math.random() + '!',
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'Content-Type': 'text/html' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(req);

    const updated = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(res.status).toBe(415);

    expect(updated).not.toBeNull();
    expect(updated?.email).toBe(account.email);
    expect(updated?.id).toBe(createdAcc.id);

    // make sure password was not changed
    expect(await bcrypt.compare(account.password!, updated!.password)).toBe(false);
    expect(updated?.password).toBe(createdAcc.password);
  });

  test('Negative: PATCH without email', async () => {
    const account: Partial<AccountCreateInput> = {
      password: 'newSecurePassword' + Math.random() + '!',
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(req);

    expect(res.status).toBe(400);

    const updated = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(updated).not.toBeNull();
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.id).toBe(createdAcc.id);

    // make sure password was not changed
    expect(await bcrypt.compare(account.password!, updated!.password)).toBe(false);
    expect(updated?.password).toBe(createdAcc.password);
  });

  test('Negative: PATCH without password', async () => {
    const account: Partial<AccountCreateInput> = {
      email: createdAcc.email,
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(req);

    expect(res.status).toBe(400);

    const updated = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(updated).not.toBeNull();
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.id).toBe(createdAcc.id);
    expect(updated?.password).toBe(createdAcc.password);
  });

  test('Negative: PATCH with invalid password length', async () => {
    const account: Partial<AccountCreateInput> = {
      email: createdAcc.email,
      password: '123',
    };

    const req = new NextRequest(baseUrl, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(account),
    });

    const res = await PATCH(req);

    expect(res.status).toBe(400);

    const updated = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(updated).not.toBeNull();
    expect(updated?.email).toBe(createdAcc.email);
    expect(updated?.id).toBe(createdAcc.id);

    // make sure password was not changed
    expect(await bcrypt.compare(account.password!, updated!.password)).toBe(false);
    expect(updated?.password).toBe(createdAcc.password);
  });
});
