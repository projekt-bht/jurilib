import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { deleteUser, readUser, updateUser } from './services';
import z from 'zod';
import { Role } from '~/generated/prisma/enums';
import { User } from '~/generated/prisma/browser';

const UpdateSchema = z.object({
  id: z.string().min(36),
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(Role).optional().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userID: string }> }) {
  try {
    const { userID } = await params;
    if (!userID) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await readUser(userID);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userID: string }> }) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }
    const { userID } = await params;
    if (!userID) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const validatedBody = UpdateSchema.parse(body);

    const updatedUser = await updateUser(validatedBody as User, userID);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Problem: ' + (error as Error).message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update User: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    const { userID } = await params;
    if (!userID) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    await deleteUser(userID);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete User: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
