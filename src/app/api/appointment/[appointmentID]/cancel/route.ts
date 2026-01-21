import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, withUserAuth } from '@/app/api/helper';

import { isAppointmentUserMatch } from '../helpers';
import { cancelAppointment } from './services';

/**
 * Validate parameter appointmentID as uuid
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  appointmentID: z.uuid({ error: 'Appointment ID is required' }),
});

// Booking Endpoint for user interaction. Requires authentication. Sets status to "OPEN"
async function cancelPOST(
  _req: NextRequest,
  { params, userId }: { params: Promise<{ appointmentID: string }>; userId: string }
) {
  try {
    // get appointmentID from URL params
    const { appointmentID } = await params;
    paramsSchema.parse({ appointmentID });

    // verify user matches the appointment
    if (await isAppointmentUserMatch(appointmentID, userId)) {
      // cancel appointment
      const canceledAppointment = await cancelAppointment(appointmentID);
      return NextResponse.json(canceledAppointment, { status: 200 });
    } else {
      // unauthorized
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
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

// POST /api/appointment/:appointmentID/cancel
export const POST = withUserAuth(cancelPOST);
