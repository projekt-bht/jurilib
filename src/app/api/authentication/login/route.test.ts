import { Gender } from '~/generated/prisma/enums';
import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

import { createAccount } from '../../account/services';
import { createUser } from '../../user/services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST, DELETE } = await import('@/app/api/authentication/login/route');

describe('Login test', () => {
  const loginURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/login`;
  let createdAccount = {};

  test('Create Account and User', async () => {
    const accountInput: AccountCreateInput = {
      email: 'PETER_USER_REGISTERE' + Math.random() + '@mail.de',
      password: '123456',
      type: 'USER',
    };

    const account = await createAccount(accountInput);

    const userInput: UserCreateInput = {
      firstname: 'PETER_USER_REGISTER',
      lastname: 'TEST',
      gender: Gender.Mann,
      birthdate: new Date('1990-01-01'),
      country: 'Germany',
      city: 'Berlin',
      zipCode: '10115',
      street: 'Alexanderplatz',
      houseNumber: '1A',
      account: {
        connect: undefined, // Wird später gesetzt (user Service),
      },
    };

    await createUser(userInput, account.id!);

    createdAccount = { email: accountInput.email, password: accountInput.password };
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
