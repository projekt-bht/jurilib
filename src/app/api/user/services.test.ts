import { NextRequest } from 'next/server';

import { AccountType, Gender, Pronoun, type User } from '~/generated/prisma/client';

import { readUsers } from './services';
import { RegisterResource } from '@/services/Resources';
const { POST } = await import('@/app/api/authentication/register/route');

const { prisma } = await import('@/lib/db');

describe('User testen', () => {
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

  test('GET Users', async () => {
    const users = await readUsers();
    expect(users.length).not.toBe(0);
  });
});
