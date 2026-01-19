import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleValidationError, validateHeader, validateIds } from '@/app/api/helper';

import { createAppointment, readAllAppointmentsByEmployee } from './services';

/**
 * Validate the attributes needed to create an appointment
 * dateTimeEnd is not included, as it is calculated based on dateTimeStart and duration
 * dateTimeStart is validated by checking if it can be parsed to a valid Date object
 */
// const appointmentCreateSchema = z.object({
const appointmentCreateSchema = z.strictObject({
  dateTimeStart: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
    message: 'Invalid date format',
  }),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
});

// POST /api/appointment/employee/:employeeID
// Create a new appointment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    // validate header
    validateHeader(req.headers);

    // validate params
    const { employeeID } = await params;
    validateIds([{ id: employeeID, identifier: 'employeeID' }]);

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
  _req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    // validate employeeID
    const { employeeID } = await params;
    validateIds([{ id: employeeID, identifier: 'employeeID' }]);

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
