import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import {
  handleError,
  handleZodError,
  unauthorized,
  validateHeader,
  validateIds,
} from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';
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
    validateIds([{ id: userID, identifier: 'userID' }]);

    const user = await readUser(userID);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to read User');
  }
}

// PATCH /api/user/:userID
// used to update user information
export const PATCH = withUserAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ userID: string }> },
    account: UserLoginResource
  ) => {
    try {
      validateHeader(req.headers);
      const { userID } = await params;
      validateIds([{ id: userID, identifier: 'userID' }]);
      if (!(userID === account.userId)) return unauthorized();
      const body = await req.json();
      const validatedBody = UpdateSchema.parse(body);

      const updatedUser = await updateUser(validatedBody as UserUpdateInput, userID);
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      }
      return handleError(error, 'Failed to update User');
    }
  }
);

/**
 * There is no DELETE endpoint for user as users are deleted through the account endpoint
 * when an account is deleted, which in turn calls the deleteUserTx function in services.ts.
 * This ensures that all related data is cleaned up properly in a transaction.
 */
