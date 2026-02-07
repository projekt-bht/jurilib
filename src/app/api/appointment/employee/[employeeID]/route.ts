import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  handleError,
  handleZodError,
  unauthorized,
  validateHeader,
  validateIds,
} from '@/app/api/helper';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';

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
export const POST = withEmployeeAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ employeeID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      // validate header
      validateHeader(req.headers);

      // validate params
      const { employeeID } = await params;
      validateIds([{ id: employeeID, identifier: 'employeeID' }]);

      // validate body
      const body = appointmentCreateSchema.parse(await req.json());

      // check if loginResource and employeeid given by url-param are the same
      if (!(employeeID === account.employeeId)) return unauthorized();

      const createdAppointment = await createAppointment(employeeID, body);
      return NextResponse.json(createdAppointment, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Creating appointment failed');
      }
    }
  }
);

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
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to read Appointments');
    }
  }
}
