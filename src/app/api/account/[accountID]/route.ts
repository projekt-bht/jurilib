import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { deleteEmployeeTx } from '@/app/api/employee/[employeeID]/services';
import { handleValidationError, validateHeader, validateIds } from '@/app/api/helper';
import { deleteUserTx } from '@/app/api/user/[userID]/services';
import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Account } from '~/generated/prisma/client';
import { AccountType } from '~/generated/prisma/client';

import { deleteAccountTx, readAccount, updateAccount } from './services';

const UpdateSchema = z.strictObject({
  email: z.email({ message: 'Invalid email format' }).optional(),
  password: z
    .string()
    .min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8)
    .optional(),
  isVerified: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  try {
    const { accountID } = await params;
    validateIds([{ id: accountID, identifier: 'accountID' }]);

    const account = await readAccount(accountID);
    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  try {
    validateHeader(req.headers);

    const { accountID } = await params;
    validateIds([{ id: accountID, identifier: 'accountID' }]);

    // validate body
    const body = await req.json();
    const data = UpdateSchema.parse(body) as Partial<Account>;

    const updatedAccount = await updateAccount(accountID, data);
    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { message: 'Failed to update account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ accountID: string }> }
) {
  try {
    const { accountID } = await params;
    validateIds([{ id: accountID, identifier: 'accountID' }]);

    /**
     * Delete Account and associated User/Employee in a transaction
     * This ensures that either both records are deleted or none at all
     */
    await prisma.$transaction(async (tx) => {
      // First, delete any associated User or Employee record
      const account = await tx.account.findUnique({
        where: { id: accountID },
      });

      if (!account) {
        throw new ValidationError('notFound', 'account', accountID, 404);
      }

      if (account.type === AccountType.USER) {
        await deleteUserTx(accountID, tx);
      } else if (account.type === AccountType.EMPLOYEE) {
        await deleteEmployeeTx(accountID, tx);
      } else {
        throw new ValidationError('invalidInput', 'type', account.type);
      }

      await deleteAccountTx(accountID, tx);
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
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
