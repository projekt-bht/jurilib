import { Gender } from '~/generated/prisma/enums';
import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST } = await import('@/app/api/authentication/register/route');

describe('Account Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;

  test('POST Register User', async () => {
    const account: AccountCreateInput = {
      email: 'PETER_USER_REGISTERE' + Math.random() + '@mail.de',
      password: '123456',
      type: 'USER',
    };

    const user: UserCreateInput = {
      firstname: 'PETER_USER_REGISTER',
      lastname: 'MUSTER',
      birthdate: new Date('1990-01-01'),
      gender: Gender.Frau,
      country: 'Germany',
      city: 'Berlin',
      zipCode: '10115',
      street: 'Musterstraße 1',
      houseNumber: '1A',

      account: {
        connect: undefined, // Wird später gesetzt (user Service),
      },
    };

    const struct = {
      account: account,
      entity: user,
    };

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(struct),
    });

    const res = await POST(req);
    expect(res!.status).toBe(201);
  });
});
