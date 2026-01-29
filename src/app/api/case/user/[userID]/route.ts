import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { getCasesByUser } from './services';

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
      validateIds([{ id: userID, identifier: 'userID' }]);

      if (!(userID === account.userId)) return unauthorized();
      const cases = await getCasesByUser(account.userId);
      return NextResponse.json(cases, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Failed to get cases by user');
      }
    }
  }
);
