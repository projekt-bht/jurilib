import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';

import { isAppointmentEmployeeMatch } from './helpers';
import { confirmAppointmentCreateCase } from './services';

// POST /api/appointment/employee/:employeeId/:appointmentId/confirm
// Booking Endpoint for employee interaction. Requires authentication. Sets status to "CONFIRMED". Creates Case with given appointment
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    // get appointmentId from URL params
    const { employeeID, appointmentID } = await params;
    validateIds([
      { id: employeeID, identifier: 'employeeID' },
      { id: appointmentID, identifier: 'appointmentID' },
    ]);

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
      return unauthorized();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to confirm Appointment');
    }
  }
}
