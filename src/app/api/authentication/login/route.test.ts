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
import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';

const { POST: accountPOST } = await import('@/app/api/authentication/register/route');
// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST, DELETE } = await import('@/app/api/authentication/login/route');

describe('Login test', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
  const loginURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/login`;
  let createdAccount = {};

  test('Create Account and User', async () => {
    // Create both account and user through registration route
    const registerInput: RegisterResource = {
      account: {
        email: 'PETER_USER_REGISTERE' + Math.random() + '@mail.de',
        password: '123456789',
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

    const res = await accountPOST(req);
    expect(res!.status).toBe(201);

    createdAccount = {
      email: registerInput.account.email,
      password: registerInput.account.password,
    };
  });

  test('Login with User', async () => {
    const req = new NextRequest(loginURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdAccount),
    });

    const res = await POST(req);
    expect(res.cookies.get('access_token')?.value).not.toBeUndefined();
    expect(res!.status).toBe(200);
  });

  test('Delete Cookie', async () => {
    const req = new NextRequest(loginURL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdAccount),
    });

    const res = await DELETE(req);
    expect(res.cookies.get('access_token')?.value).toBe('');
    expect(res!.status).toBe(200);
  });
});
export {};
