// TODO: check ZOD validation

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import type { UserUpdateInput } from '~/generated/prisma/models';

import { readUser, updateUser } from './services';

const UpdateSchema = z.strictObject({
  title: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  birthdate: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional(),
  genderText: z.string().optional(),
  pronoun: z.string().optional(),
  pronounText: z.string().optional(),
  phone: z.string().optional(),
  imageURL: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  //type: z.enum(AccountType).optional(), // should it be changeable?
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

    const updatedUser = await updateUser(validatedBody as UserUpdateInput, userID);
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

/**
 * There is no DELETE endpoint for user as users are deleted through the account endpoint
 * when an account is deleted, which in turn calls the deleteUserTx function in services.ts.
 * This ensures that all related data is cleaned up properly in a transaction.
 */
