import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, validateIds } from '../../../helper';
import { readAllAppointmentsByUser } from './service';

// GET api/appointment/user/:userID
// Retrieve all appointments of user
export async function GET(req: NextRequest, { params }: { params: Promise<{ userID: string }> }) {
  try {
    // validate userID
    const { userID } = await params;
    validateIds([{ id: userID, identifier: 'userID' }]);

    const appointments = await readAllAppointmentsByUser(userID);
    return NextResponse.json(appointments, { status: 200 });
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
