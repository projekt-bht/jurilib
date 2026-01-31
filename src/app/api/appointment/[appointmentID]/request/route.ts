import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';

import { bookAppointment } from './services';

// POST /api/appointment/:appointmentID/request
// Booking Endpoint for user interaction. Requires authentication. Sets status to "REQUESTED"
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

    // book apppointment
    const bookedAppointment = await bookAppointment(appointmentID, userId);
    return NextResponse.json(bookedAppointment, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to book Appointment');
    }
  }
}
