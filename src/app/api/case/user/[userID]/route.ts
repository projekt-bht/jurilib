import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, unauthorized } from '@/app/api/helper';

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
export async function GET(req: NextRequest, { params }: { params: Promise<{ userID: string }> }) {
  try {
    // get userId from Header
    const userId = req.headers.get('userID');
    if (!userId) return unauthorized();

    // get userID from URL params to check if it's a valid uuid
    const { userID } = await params;
    paramsSchema.parse({ userID });

    const cases = await getCasesByUser(userId);
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
