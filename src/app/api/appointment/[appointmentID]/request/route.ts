import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, unauthorized } from '@/app/api/helper';

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
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appointmentID: string }> }
) {
  try {
    // get userId from Header
    const userId = req.headers.get('userID');
    if (!userId) throw unauthorized();

    // get appointmentID from URL params
    const { appointmentID } = await params;
    paramsSchema.parse({ appointmentID });

    // book apppointment
    const bookedAppointment = await bookAppointment(appointmentID, userId);
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
