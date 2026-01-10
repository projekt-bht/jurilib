import { jest } from '@jest/globals';

jest.mock('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('@/app/api/email/service', () => ({
  sendRegistrationCodeEmail: jest.fn(),
}));

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/authentication/register/route');

describe('Account Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;

  test('POST Register User', async () => {
    const registerInput = {
      email: 'PETER_USER_REGISTERE' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
      name: 'Peter Mustermann',
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const res = await POST(req);
    expect(res!.status).toBe(201);
  });
});
export {};
