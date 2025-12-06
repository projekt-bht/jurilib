import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { Role } from '~/generated/prisma/enums';

import { deleteAccount, readAccount, updateAccount } from './services';

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

    const organization = await readAccount(accountID);
    return NextResponse.json(organization, { status: 200 });
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

    const updatedAccount = await updateAccount(data, accountID);
    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
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
