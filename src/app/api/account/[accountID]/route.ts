import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { type Account, AccountType } from '~/generated/prisma/client';

import { deleteAccount, readAccount, updateAccount } from './services';

const UpdateSchema = z.strictObject({
  id: z.string().min(36),
  email: z.string(),
  password: z.string().min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8),
  type: z.enum(AccountType),
  // is this the right place to update this?
  isVerified: z.boolean().optional(),
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
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    const updatedAccount = await updateAccount(data as Account, accountID);
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
  try {
    const { accountID } = await params;
    if (!accountID) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }
    await deleteAccount(accountID);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete Account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
