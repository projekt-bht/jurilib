import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { Role } from '~/generated/prisma/enums';

import { createAccountTx } from '../../account/services';
import { createEmployeeTx } from '../../employee/services';
import { createUserTx } from '../../user/services';

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const createdAccount = await createAccountTx(body.account, tx);

      if (createdAccount.role === Role.USER) {
        return await createUserTx(body.entity, createdAccount.id!, tx);
      } else if (createdAccount.role === Role.EMPLOYEE) {
        return await createEmployeeTx(body.entity, createdAccount.id!, tx);
      } else {
        throw new ValidationError('invalidInput', 'role', createdAccount.role);
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
