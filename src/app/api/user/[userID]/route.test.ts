import type { RegisterResource } from '@/services/Resources';
import { AccountType, Gender, Pronoun, type User } from '~/generated/prisma/client';
import type { UserUpdateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH } = await import('@/app/api/user/[userID]/route');
const { DELETE } = await import('@/app/api/account/[accountID]/route');
const { POST } = await import('@/app/api/authentication/register/route');

describe('User Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}user/[userID]`;
  const registrationURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;
  let cUser: User;

  test('create User', async () => {
    // create both account and user through registration
    const registrationInput: RegisterResource = {
      account: {
        email: 'petra' + Math.random() + '@mail.de',
        password: '123456789',
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

    const user: UserUpdateInput = {
      firstname: 'updatedPeter',
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
      where: { id: cUser.id },
    });

    expect(updated?.firstname).toBe('updatedPeter');
    expect(res.status).toBe(200);
  });

  test('PATCH User with invalid data', async () => {
    const data = {
      id: 12345,
    };
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

  test('PATCH User with invalid attributes', async () => {
    const data = {
      invalidAttr: 'invalid',
    };
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

  test('DELETE User through account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, { params: Promise.resolve({ accountID: cUser.accountId }) });
    expect(res.status).toBe(200);
    const deleted = await prisma.user.findUnique({ where: { id: cUser.id } });
    expect(deleted).toBeNull();
  });

  test('DELETE non-existing User', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });
    expect(res.status).toBe(404);
  });
});
