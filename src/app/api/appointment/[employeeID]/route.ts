import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, headerSchema } from '../../helper';
import { createAppointment, readAllAppointmentsByEmployee } from './services';

/**
 * Validate parameter employeeID
 */
const paramsSchema = z.object({
  employeeID: z.string().min(1, 'Employee ID is required'),
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

// POST /api/appointment/:employeeID
// Create a new appointment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    // validate header
    headerSchema.parse(req.headers);
    // validate params
    const { employeeID } = await params;
    paramsSchema.parse({ employeeID });
    // validate body
    const body = appointmentCreateSchema.parse(await req.json());

    const createdAppointment = await createAppointment(employeeID, body);
    return NextResponse.json(createdAppointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return NextResponse.json(
        { message: 'Creation failed: ' + (error as Error).message },
        { status: 400 }
      );
    }
  }
}

// GET /api/appointment/:employeeID
// Retrieve all appointments of employee
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    // validate employeeID
    const { employeeID } = await params;
    paramsSchema.parse({ employeeID });
    const appointments = await readAllAppointmentsByEmployee(employeeID);
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
