import { jest } from '@jest/globals';

import type { User } from '~/generated/prisma/browser';
import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

import { createAccount } from '../../account/services';
import { createUser } from '../services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH, DELETE } = await import('@/app/api/user/[userID]/route');
const { POST } = await import('@/app/api/account/route');

describe('User Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}user/[userID]`;
  let cUser: User;

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
    cUser = createdUser;
    expect(createdAccount.id).toBe(createdUser.accountId);
  });

  test('GET User', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ userID: cUser.id }) });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('GET non-existing User', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ userID: 'non-existing-id' }) });
    expect(res.status).toBe(404);
  });

  test('PATCH User name', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ userID: cUser.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const user: UserCreateInput = {
      id: cUser.id,
      name: 'updatedPeter',
      account: {
        connect: { id: cUser.accountId },
      },
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(user),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ userID: cUser.id }),
    });

    const updated = await prisma.user.findFirst({
      where: { name: user.name },
    });

    expect(updated?.name).toBe('updatedPeter');
    expect(res.status).toBe(200);
  });

  test('PATCH User with invalid data', async () => {
    const data = {};
    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ userID: cUser.id }),
    });
    expect(res.status).toBe(400);
  });

  test('DELETE User', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ userID: cUser.id }) });
    expect(res.status).toBe(200);
  });

  test('DELETE non-existing User', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ userID: 'non-existing-id' }),
    });
    expect(res.status).toBe(400);
  });
});
