import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleValidationError, unauthorized, validateIds } from '@/app/api/helper';

import { isAppointmentUserMatch } from '../helpers';
import { cancelAppointment } from './services';

// POST /api/appointment/:appointmentID/cancel
// Booking Endpoint for user interaction. Requires authentication. Sets status to "OPEN"
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appointmentID: string }> }
) {
  try {
    // get userId from Header
    const userId = req.headers.get('userID');
    if (!userId) return unauthorized();

    // get appointmentID from URL params
    const { appointmentID } = await params;
    validateIds([{ id: appointmentID, identifier: 'appointmentID' }]);

    // verify user matches the appointment
    if (await isAppointmentUserMatch(appointmentID, userId)) {
      // cancel appointment
      const canceledAppointment = await cancelAppointment(appointmentID);
      return NextResponse.json(canceledAppointment, { status: 200 });
    } else {
      // unauthorized
      return unauthorized();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return handleError(error, 'Failed to cancel Appointment');
    }
  }
}
