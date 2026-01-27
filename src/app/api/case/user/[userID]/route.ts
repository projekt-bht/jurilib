import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, unauthorized } from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { getCasesByUser } from './services';

/**
 * Validate parameter appointmentID as uuid
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  userID: z.uuid({ error: 'Appointment ID is required' }),
});

// GET /api/case/user/:userID
// Show all cases from a single user
export const GET = withUserAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ userID: string }> },
    account: UserLoginResource
  ) => {
    try {
      // get userID from URL params to check if it's a valid uuid
      const { userID } = await params;
      paramsSchema.parse({ userID });

      if (!(userID === account.userId)) return unauthorized();

      const cases = await getCasesByUser(account.userId);
      return NextResponse.json(cases, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Creation failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  }
);
