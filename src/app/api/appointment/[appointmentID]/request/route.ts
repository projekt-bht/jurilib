import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError } from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { bookAppointment } from './services';

/**
 * Validate parameter appointmentID as uuid
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  appointmentID: z.uuid({ error: 'Appointment ID is required' }),
});

// POST /api/appointment/:appointmentID/request
// Booking Endpoint for user interaction. Requires authentication. Sets status to "REQUESTED"
export const POST = withUserAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ appointmentID: string }> },
    account: UserLoginResource
  ) => {
    try {
      // get appointmentID from URL params
      const { appointmentID } = await params;
      paramsSchema.parse({ appointmentID });

      // book apppointment
      const bookedAppointment = await bookAppointment(appointmentID, account.userId);
      return NextResponse.json(bookedAppointment, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Update failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  }
);
