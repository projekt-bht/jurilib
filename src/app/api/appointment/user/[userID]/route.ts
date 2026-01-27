import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { handleValidationError, unauthorized } from '../../../helper';
import { readAllAppointmentsByUser } from './service';

// GET api/appointment/:userID
// Retrieve all appointments of user
export const GET = withUserAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ userID: string }> },
    account: UserLoginResource
  ) => {
    try {
      // validate userID
      const { userID } = await params;
      paramsSchema.parse({ userID });

      // check if loginResource and userid given by url-param are the same
      if (!(userID === account.userId)) return unauthorized();

      const appointments = await readAllAppointmentsByUser(account.userId);
      return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Read failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  }
);

/**
 * Validate parameter userID
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  userID: z.string().min(1, 'User ID is required'),
});
