import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { readAllAppointmentsByUser } from './service';

// GET api/appointment/user/:userID
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
      validateIds([{ id: userID, identifier: 'userID' }]);

      // check if loginResource and userid given by url-param are the same
      if (!(userID === account.userId)) return unauthorized();

      const appointments = await readAllAppointmentsByUser(account.userId);
      return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Reading appointments by user failed');
      }
    }
  }
);
