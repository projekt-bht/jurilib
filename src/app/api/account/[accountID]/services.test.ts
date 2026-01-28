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
import { type Account, AccountType, Gender, Pronoun } from '~/generated/prisma/client';

import { readAccount, updateAccount } from './services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/authentication/register/route');

describe('Account Routen testen', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account`;
  const fakeAccoutID = '00000000-4af3-4b8c-8601-000000000000';
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

  test('Positive: read Account', async () => {
    const account = await readAccount(createdAcc.id);

    expect(account).not.toBeNull();

    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        type: expect.any(String),
        isVerified: expect.any(Boolean),
      })
    );

    expect(account.id).toBe(createdAcc.id);
    expect(account.email).toBe(createdAcc.email);
    expect(account.type).toBe(createdAcc.type);
    expect(account.isVerified).toBe(createdAcc.isVerified);
  });

  test('Negative: read Account with non existing ID', async () => {
    expect(async () => {
      await readAccount(fakeAccoutID);
    }).rejects.toThrow('notFound');
  });

  test('Positive: update email', async () => {
    const account = await updateAccount(createdAcc.id, {
      email: 'peter' + Math.random() + '@mail.de',
    });

    expect(account).not.toBeNull();

    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        type: expect.any(String),
        isVerified: expect.any(Boolean),
      })
    );

    expect(account.id).toBe(createdAcc.id);
    expect(account.email).not.toBe(createdAcc.email);
    expect(account.type).toBe(createdAcc.type);
    expect(account.isVerified).toBe(createdAcc.isVerified);

    // Save new email for further tests
    createdAcc.email = account?.email ?? createdAcc.email;
  });

  test('Positive: update password', async () => {
    const newPassword = 'superDuperSecurePassword123!';

    const account = await updateAccount(createdAcc.id, {
      password: newPassword,
    });

    expect(account).not.toBeNull();

    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        type: expect.any(String),
        isVerified: expect.any(Boolean),
      })
    );

    expect(account.id).toBe(createdAcc.id);
    expect(account.email).toBe(createdAcc.email);
    expect(account.type).toBe(createdAcc.type);
    expect(account.isVerified).toBe(createdAcc.isVerified);

    // Verify that password was changed in DB
    const updatedAccInDb = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    expect(updatedAccInDb).not.toBeNull();
    expect(updatedAccInDb?.password).not.toBe(newPassword); // should be hashed
    expect(await bcrypt.compare(newPassword, updatedAccInDb?.password ?? '')).toBe(true);

    // Save new password for further tests
    createdAcc.password = account?.password ?? createdAcc.password;
  });

  test('Positive: update isVerified', async () => {
    // make sure isVerified is false before updating
    expect(createdAcc.isVerified).toBe(false);

    const account = await updateAccount(createdAcc.id, {
      isVerified: true,
    });

    expect(account).not.toBeNull();

    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        type: expect.any(String),
        isVerified: expect.any(Boolean),
      })
    );

    expect(account.id).toBe(createdAcc.id);
    expect(account.email).toBe(createdAcc.email);
    expect(account.type).toBe(createdAcc.type);
    expect(account.isVerified).toBe(true);

    // Save new isVerified for further tests
    createdAcc.isVerified = account?.isVerified ?? createdAcc.isVerified;
  });

  test('Negative: update non existing account', async () => {
    expect(async () => {
      await updateAccount(fakeAccoutID, { id: fakeAccoutID });
    }).rejects.toThrow('notFound');

    // make sure id was not changed
    const accountInDb = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    expect(accountInDb).not.toBeNull();
    expect(accountInDb?.id).toBe(createdAcc.id);
  });

  test('Negative: update immutable field id', async () => {
    expect(async () => {
      await updateAccount(createdAcc.id, { id: fakeAccoutID });
    }).rejects.toThrow('immutableField');

    // make sure id was not changed
    const accountInDb = await prisma.account.findUnique({
      where: { id: createdAcc.id },
    });
    expect(accountInDb).not.toBeNull();
    expect(accountInDb?.id).toBe(createdAcc.id);
  });

  test('Negative: update immutable field type', async () => {
    expect(async () => {
      await updateAccount(createdAcc.id, { type: AccountType.EMPLOYEE });
    }).rejects.toThrow('notFound');
  });

  /**
   * Delete cannot be directly tested via service, as it requires transaction
   * with User/Employee deletion. It is however tested in the route test.
   */
});
