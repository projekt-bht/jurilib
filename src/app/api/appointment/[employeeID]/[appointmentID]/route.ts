import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AppointmentStatus } from '~/generated/prisma/enums';

import { handleValidationError, headerSchema } from '../route';
import { deleteAppointment, updateAppointment } from './service';

/**
 * Validate parameter employeeID and appointmentID
 */
const paramsSchema = z.object({
  employeeID: z.string().min(1, 'Employee ID is required'),
  appointmentID: z.string().min(1, 'Appointment ID is required'),
});

/**
 * Validate the attributes that can be updated in an appointment
 * attributes not included here cannot be updated
 * dateTimeEnd is not included, as it is calculated based on dateTimeStart and duration
 */
export const appointmentUpdateSchema = z.object({
  serviceID: z.string().min(1, 'Service ID is required').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  status: z.enum(AppointmentStatus, { message: 'Invalid status value' }).optional(),
  location: z.string().optional(),
  meetingLink: z.string().optional(), // may require URL validation later
  dateTimeStart: z
    .string()
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Invalid date format',
    })
    .optional(),
  notes: z.string().optional(),
});

// GET /api/appointment/:employeeID/:appointmentID
// Retrieve a specific appointment (to be implemented)
export async function GET(_req: NextRequest) {}

// PATCH /api/appointment/:employeeID/:appointmentID
// Update an appointment (to be implemented)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    //validate header
    headerSchema.parse(req.headers);
    // validate params
    const { employeeID, appointmentID } = await params;
    paramsSchema.parse({ employeeID, appointmentID });
    // validate body
    const body = appointmentUpdateSchema.parse(await req.json());
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Update data is required' }, { status: 400 });
    }

    // update appointment
    const updatedAppointment = await updateAppointment(employeeID, appointmentID, body);
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

// DELETE /api/appointment/:employeeID/:appointmentID
// Delete an appointment (to be implemented)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string; appointmentID: string }> }
) {
  try {
    //validate header
    headerSchema.parse(req.headers);
    // validate params
    const { employeeID, appointmentID } = await params;
    paramsSchema.parse({ employeeID, appointmentID });

    // delete appointment
    await deleteAppointment(employeeID, appointmentID);
    return NextResponse.json({ message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Delete failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
