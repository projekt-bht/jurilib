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
import { AccountType, Gender, Pronoun, type User } from '~/generated/prisma/browser';

const { prisma } = await import('@/lib/db');

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { GET } = await import('@/app/api/user/route');
const { POST } = await import('@/app/api/authentication/register/route');

describe('User Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/user`;
  const registrationURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;
  let cUser: User;

  test('create User', async () => {
    // create both account and user through registration
    const registrationInput: RegisterResource = {
      account: {
        email: 'petra' + Math.random() + '@mail.de',
        password: '1234567890',
        type: AccountType.USER,
      },
      entity: {
        firstname: 'Petra',
        lastname: 'Muster',
        gender: Gender.Frau,
        pronoun: Pronoun.sie_ihr,
        birthdate: new Date('1992-05-15'),
      },
    };

    // TODO: Rausfinden, warum das auch mit der baseUrl funktioniert
    const request = new NextRequest(registrationURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationInput),
    });

    const resRegistration = await POST(request);
    expect(resRegistration.status).toBe(201);
    cUser = await resRegistration.json();

    const createdAccount = await prisma.account.findUnique({
      where: { email: registrationInput.account.email },
    });

    expect(createdAccount?.id).toBe(cUser.accountId);
  });

  test('GET Accounts', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
