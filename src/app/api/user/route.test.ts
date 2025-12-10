import { jest } from '@jest/globals';

import prisma from '@/lib/db';
import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

import { createAccount } from '../account/services';
import { createUser } from './services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { GET } = await import('@/app/api/user/route');

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
});

describe('User Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/user`;

  test('POST User', async () => {
    const account: AccountCreateInput = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
    };

    const createdAccount = await createAccount(account);

    const user: UserCreateInput = {
      name: 'peter',
      account: {
        connect: { id: createdAccount.id },
      },
    };

    const createdUser = await createUser(user, createdAccount.id!);
    expect(createdAccount.id).toBe(createdUser.accountId);
  });

  test('GET Accounts', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
