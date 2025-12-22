import type { User } from '~/generated/prisma/browser';

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
    const registrationInput = {
      email: 'petra' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
      name: 'Petra Muster',
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
    console.log('TEST USER - created user:', cUser);

    const createdAccount = await prisma.account.findUnique({
      where: { email: registrationInput.email },
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
