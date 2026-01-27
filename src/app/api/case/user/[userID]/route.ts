import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';

import { getCasesByUser } from './services';

// GET /api/case/user/:userID
// Show all cases from a single user
export async function GET(req: NextRequest, { params }: { params: Promise<{ userID: string }> }) {
  try {
    // get userId from Header
    const userId = req.headers.get('userID');
    if (!userId) return unauthorized();

    // get userID from URL params to check if it's a valid uuid
    const { userID } = await params;
    validateIds([{ id: userID, identifier: 'userID' }]);

    const cases = await getCasesByUser(userId);
    return NextResponse.json(cases, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to get cases by user');
    }
  }
}
