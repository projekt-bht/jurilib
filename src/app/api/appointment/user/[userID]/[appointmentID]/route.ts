import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';
import { AppointmentStatus } from '~/generated/prisma/enums';

import { handleValidationError, unauthorized, validateHeader } from '../../../../helper';
import { readAppointment, updateAppointment } from './service';

// GET /api/appointment/:userID/:appointmentID
// Retrieve a specific appointment of user
export const GET = withUserAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ userID: string; appointmentID: string }> },
    account: UserLoginResource
  ) => {
    try {
      //validate header
      validateHeader(req.headers);
      // validate params
      const { userID, appointmentID } = await params;
      paramsSchema.parse({ userID, appointmentID });

      // check if loginResource and userid given by url-param are the same
      if (!(userID === account.userId)) return unauthorized();

      // read appointment
      const appointment = await readAppointment(userID, appointmentID);
      return NextResponse.json(appointment, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Read failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  }
);

// PATCH /api/appointment/:userID/:appointmentID
// Update an appointment of user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string; appointmentID: string }> }
) {
  try {
    //validate header
    validateHeader(req.headers);
    // validate params
    const { userID, appointmentID } = await params;
    paramsSchema.parse({ userID, appointmentID });
    // validate body
    const body = z
      .object({
        status: z.enum(AppointmentStatus, { message: 'Invalid appointment status' }).optional(),
      })
      .parse(await req.json());
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Update data is required' }, { status: 400 });
    }

    // update appointment
    const updatedAppointment = await updateAppointment(userID, appointmentID, body.status);
    return NextResponse.json(updatedAppointment, { status: 200 });
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

/**
 * Validate parameter employeeID and appointmentID
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  userID: z.string().min(1, 'User ID is required'),
  appointmentID: z.string().min(1, 'Appointment ID is required'),
});
