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

import { readAccounts, updatePasswordWithEmail } from './services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/authentication/register/route');
const { DELETE } = await import('@/app/api/account/[accountID]/route');

describe('Account Routen testen', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account`;
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
    expect(result!.email).toBe(registerInput.account.email);
    expect(result!.type).toBe(registerInput.account.type);
    expect(result!.isVerified).toBe(false);
    expect(await bcrypt.compare(registerInput.account.password, result!.password)).toBe(true);
    expect(result!.password).not.toBe(registerInput.account.password); // Ensure password is hashed
    createdAcc = result as Account;
  });

  /**
   * createAccount is implycitly tested in the setup test
   */

  test('Positive: Read all Accounts', async () => {
    const accounts = await readAccounts();

    expect(accounts.length).not.toBe(0);
    expect(accounts.some((acc) => acc.id === createdAcc.id)).toBe(true);
  });

  test('Positive: update Password with Email', async () => {
    const newPassword = 'newSecurePassword' + Math.random() + '!';

    await updatePasswordWithEmail(createdAcc.email, newPassword);

    const updatedAccount = await prisma.account.findUnique({
      where: { email: createdAcc.email },
    });

    expect(updatedAccount).not.toBeNull();
    expect(await bcrypt.compare(newPassword, updatedAccount!.password)).toBe(true);
    // Ensure password is hashed
    expect(updatedAccount!.password).not.toBe(newPassword);
    // Ensure password is changed
    expect(updatedAccount!.password).not.toBe(createdAcc.password);
    // Ensure other fields are unchanged
    expect(updatedAccount!.id).toBe(createdAcc.id);
    expect(updatedAccount!.email).toBe(createdAcc.email);
    expect(updatedAccount!.type).toBe(createdAcc.type);
    expect(updatedAccount!.isVerified).toBe(createdAcc.isVerified);

    // Save new password for further tests
    createdAcc.password = updatedAccount!.password;
  });

  test('Negative: update Password with Email for non-existing email', async () => {
    const nonExistingEmail = 'nonexisting' + Math.random() + '@mail.de';
    const newPassword = 'anotherSecurePassword' + Math.random() + '!';

    expect(async () => {
      await updatePasswordWithEmail(nonExistingEmail, newPassword);
    }).rejects.toThrow('notFound');
  });

  // Cleanup - delete created Account and associated User
  test('Cleanup: DELETE Account', async () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;

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
