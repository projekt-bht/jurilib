import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { Role } from '~/generated/prisma/enums';

import { deleteEmployeeTx } from '../../employee/[employeeID]/services';
import { deleteUserTx } from '../../user/[userID]/services';
import { deleteAccountTx, readAccount, updateAccount } from './services';

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
  try {
    // validate header content-type
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    // validate params
    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }

    // validate body
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    // update account
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
  // TODO: add validation

  try {
    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }

    /**
     * Delete Account and associated User/Employee in a transaction
     * This ensures that either both records are deleted or none at all
     */
    await prisma.$transaction(async (tx) => {
      // First, delete any associated User or Employee record
      const account = await tx.account.findUnique({
        where: { id: accountID },
        //select: { role: true },
      });

      if (!account) {
        throw new ValidationError('notFound', 'account', accountID, 404);
      }

      if (account.role === Role.USER) {
        await deleteUserTx(accountID, tx);
      } else if (account.role === Role.EMPLOYEE) {
        await deleteEmployeeTx(accountID, tx);
      } else {
        throw new ValidationError('invalidInput', 'role', account.role);
      }

      await deleteAccountTx(accountID, tx);
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: `Validation Error: ${error.message}` },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete Account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
