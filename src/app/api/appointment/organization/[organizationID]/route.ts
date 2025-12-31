import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError } from '../../../helper';
import { readAllAppointmentsByOrganization } from './service';

// GET /api/appointment/:organizationID
// Retrieve all appointments of organization
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    // validate organizationID
    const { organizationID } = await params;
    paramsSchema.parse({ organizationID });
    const appointments = await readAllAppointmentsByOrganization(organizationID);
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

/**
 * Validate parameter organizationID
 */
const paramsSchema = z.object({
  organizationID: z.string().min(1, 'Organization ID is required'),
});
