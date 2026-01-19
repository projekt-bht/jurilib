import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleValidationError, validateIds } from '@/app/api/helper';

import { bookAppointment } from './services';

// POST /api/appointment/:appointmentID/book
// Booking Endpoint for user interaction. Requires authentication. Sets status to "REQUESTED"
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ appointmentID: string }> }
) {
  try {
    // get appointmentID from URL params
    const { appointmentID } = await params;
    validateIds([{ id: appointmentID, identifier: 'appointmentID' }]);

    // verify user is logged in
    const jwtString = _req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (loginRes.userId) {
      // book apppointment
      const bookedAppointment = await bookAppointment(appointmentID, loginRes.userId);
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
