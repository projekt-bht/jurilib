import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { isAppointmentUserMatch } from '../helpers';
import { cancelAppointment } from './services';

// POST /api/appointment/:appointmentID/cancel
// Booking Endpoint for user interaction. Requires authentication. Sets status to "OPEN"
export const POST = withUserAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ appointmentID: string }> },
    account: UserLoginResource
  ) => {
    try {
      // get appointmentID from URL params
      const { appointmentID } = await params;
      validateIds([{ id: appointmentID, identifier: 'appointmentID' }]);

      // verify user matches the appointment
      if (await isAppointmentUserMatch(appointmentID, account.userId)) {
        // cancel appointment
        const canceledAppointment = await cancelAppointment(appointmentID);
        return NextResponse.json(canceledAppointment, { status: 200 });
      } else {
        // unauthorized
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Failed to cancel Appointment');
      }
    }
  }
);
