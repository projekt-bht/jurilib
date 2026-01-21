import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleValidationError } from '@/app/api/helper';

import { cancelAppointment } from './services';
import { isAppointmentUserMatch } from '../helpers';

/**
 * Validate parameter appointmentID as uuid
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  appointmentID: z.uuid({ error: 'Appointment ID is required' }),
});

// POST /api/appointment/:appointmentID/cancel
// Booking Endpoint for user interaction. Requires authentication. Sets status to "OPEN"
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ appointmentID: string }> }
) {
  try {
    // get appointmentID from URL params
    const { appointmentID } = await params;
    paramsSchema.parse({ appointmentID });

    // verify user is logged in and matches the appointment
    const jwtString = _req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (loginRes.userId && (await isAppointmentUserMatch(appointmentID, loginRes.userId))) {
      // cancel appointment
      const bookedAppointment = await cancelAppointment(appointmentID);
      return NextResponse.json(bookedAppointment, { status: 200 });
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
