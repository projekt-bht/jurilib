import { de } from '@faker-js/faker';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { Role } from '~/generated/prisma/enums';

import { deleteAccount, readAccount, updateAccount } from './services';
import { deleteUserTx } from '../../user/[userID]/services';

const UpdateSchema = z.object({
  id: z.string().min(36),
  email: z.string(),
  password: z.string().min(6),
  role: z.enum(Role),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  try {
    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }

    const account = await readAccount(accountID);
    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  console.log('PATCH Account - Start');
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    const updatedAccount = await updateAccount(data, accountID);
    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Problem: ' + (error as Error).message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  console.log('Test ??1: programm läuft noch');
  try {
    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // First, delete any associated User or Employee record
      const account = await tx.account.findUnique({
        where: { id: accountID },
        select: { role: true },
      });

      if (!account) {
        throw new ValidationError('notFound', 'account', accountID);
      }

      if (account.role === Role.USER) {
        await deleteUserTx(accountID, tx);
      } else if (account.role === Role.EMPLOYEE) {
        await deleteEmployeeTx(accountID, tx);
      } else {
        throw new ValidationError('invalidInput', 'role', account.role);
      }

      // Then, delete the Account record itself
      await tx.account.delete({
        where: { id: accountID },
      });
    });

    console.log('Test ??2: programm läuft noch');
    console.log('ROUTE: Account ID to delete:', accountID);
    await deleteAccount(accountID);
    console.log('Test ??3: programm läuft noch');
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete Account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
