import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleValidationError, validateHeader, validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import { AppointmentStatus } from '~/generated/prisma/enums';

import { deleteAppointment, readAppointment, updateAppointment } from './service';

/**
 * Validate the attributes that can be updated in an appointment
 * attributes not included here cannot be updated
 * dateTimeEnd is not included, as it is calculated based on dateTimeStart and duration
 */
export const appointmentUpdateSchema = z.strictObject({
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  status: z.enum(AppointmentStatus, { message: 'Invalid status value' }).optional(),
  location: z.string().optional(),
  meetingLink: z.url().optional(),
  dateTimeStart: z
    .string()
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Invalid date format',
    })
    .optional(),
  notes: z.string().optional(),
});

// GET /api/appointment/:employeeID/:appointmentID
// Retrieve a specific appointment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    validateHeader(req.headers);

    // validate params
    const { employeeID, appointmentID } = await params;
    validateIds([
      { id: employeeID, identifier: 'employeeID' },
      { id: appointmentID, identifier: 'appointmentID' },
    ]);

    //read appointment
    const appointment = await readAppointment(employeeID, appointmentID);
    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return handleError(error, 'Failed to read Appointment');
    }
  }
}

// PATCH /api/appointment/:employeeID/:appointmentID
// Update an appointment
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    validateHeader(req.headers);

    // validate params
    const { employeeID, appointmentID } = await params;
    validateIds([
      { id: employeeID, identifier: 'employeeID' },
      { id: appointmentID, identifier: 'appointmentID' },
    ]);

    // validate body
    const body = appointmentUpdateSchema.parse(await req.json());
    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError('invalidInput', 'body', 'empty', 400);
    }

    // update appointment
    const updatedAppointment = await updateAppointment(employeeID, appointmentID, body);
    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return handleError(error, 'Failed to update Appointment');
    }
  }
}

// DELETE /api/appointment/:employeeID/:appointmentID
// Delete an appointment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    validateHeader(req.headers);

    // validate params
    const { employeeID, appointmentID } = await params;
    validateIds([
      { id: employeeID, identifier: 'employeeID' },
      { id: appointmentID, identifier: 'appointmentID' },
    ]);

    // delete appointment
    await deleteAppointment(employeeID, appointmentID);
    return NextResponse.json({ message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return handleError(error, 'Failed to delete Appointment');
    }
  }
}
