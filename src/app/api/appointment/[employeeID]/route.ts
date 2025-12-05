import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAppointment } from './services';

/**
 * Validate the 'content-type' of the request header is 'application/json'
 */
const headerSchema = z.object({
  'content-type': z.string().refine((val) => val.includes('application/json'), {
    message: 'Invalid content type, must be application/json',
  }),
});

/**
 * Validate the attributes needed to create an appointment
 * dateTimeEnd is not included, as it is calculated based on dateTimeStart and duration
 * dateTimeStart is validated by checking if it can be parsed to a valid Date object
 */
const appointmentCreateSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  dateTimeStart: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
    message: 'Invalid date format',
  }),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
});

// POST /api/appointment/[employeeID]
// Create a new appointment
export async function POST(req: NextRequest) {
  try {
    // validate header
    headerSchema.parse(req.headers);
    // validate body
    const body = appointmentCreateSchema.parse(await req.json());

    const createdAppointment = await createAppointment(body);
    return NextResponse.json(createdAppointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error }, { status: 400 });
    } else {
      return NextResponse.json(
        { message: 'Creation failed: ' + (error as Error).message },
        { status: 400 }
      );
    }
  }
}

// GET /api/appointment/[employeeID]
// Retrieve all appointments of employee (to be implemented)
export async function GET(_req: NextRequest) {
  // TODO: To be implemented
}
