import { NextRequest } from 'next/server';

import type { User } from '~/generated/prisma/browser';

import { readUsers } from './services';
const { POST } = await import('@/app/api/authentication/register/route');

const { prisma } = await import('@/lib/db');

describe('User testen', () => {
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

    const createdAccount = await prisma.account.findUnique({
      where: { email: registrationInput.email },
    });

    expect(createdAccount?.id).toBe(cUser.accountId);
  });

  test('GET Users', async () => {
    const users = await readUsers();
    expect(users.length).not.toBe(0);
  });
});
