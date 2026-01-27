import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleValidationError, validateIds } from '@/app/api/helper';

import { readAllAppointmentsByOrganization } from './service';

// GET /api/appointment/organization/:organizationID
// Retrieve all appointments of organization
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    // validate organizationID
    const { organizationID } = await params;
    validateIds([{ id: organizationID, identifier: 'organizationID' }]);

    const appointments = await readAllAppointmentsByOrganization(organizationID);
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return handleError(error, 'Failed to read Appointments');
    }
  }
}
