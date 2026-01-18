import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleValidationError } from '@/app/api/helper';

import { isAppointmentEmployeeMatch } from './helpers';
import { confirmAppointmentCreateCase } from './services';

/**
 * Validate parameter appointmentId as uuid
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  appointmentID: z.uuid({ error: 'AppointmentId is required' }),
  employeeID: z.uuid({ error: 'EmployeeId is required' }),
});

// POST /api/appointment/employee/:employeeId/:appointmentId/confirm
// Booking Endpoint for employee interaction. Requires authentication. Sets status to "CONFIRMED". Creates Case with given appointment
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    // get appointmentId from URL params
    const { employeeID, appointmentID } = await params;
    paramsSchema.parse({ appointmentID, employeeID });

    // verify employee is logged in
    const jwtString = _req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (
      loginRes.employeeId &&
      (await isAppointmentEmployeeMatch(appointmentID, loginRes.employeeId))
    ) {
      // book apppointment
      const bookedAppointment = await confirmAppointmentCreateCase(appointmentID, employeeID);
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
