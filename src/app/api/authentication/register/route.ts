import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Role } from '~/generated/prisma/enums';

import { createAccount } from '../../account/services';
import { createUser } from '../../user/services';

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();

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
