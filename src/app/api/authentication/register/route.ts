import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { RegisterRessource } from '@/services/Resources';
import { Role } from '~/generated/prisma/enums';

import { createAccount } from '../../account/services';
import { createUser } from '../../user/services';

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body: RegisterRessource = await req.json();
    const pw: string = body.account.password;
    if (pw.length! >= Number(process.env.PASSWORD_LENGTH)) {
      return NextResponse.json(
        {
          message:
            'Creation failed: Passwort length insufficient. Minimum Length: 8; Current Length: ' +
            pw.length,
        },
        { status: 400 }
      );
    }

    const createdAccount = await createAccount(body.account);

    switch (createdAccount.role) {
      case Role.USER:
        const createdUser = await createUser(body.entity, createdAccount.id!);
        return NextResponse.json(createdUser, { status: 201 });
      case Role.EMPLOYEE:
        //TODO
        break;
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
