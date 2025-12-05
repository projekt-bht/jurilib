import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/client';
import type { AppointmentCreateInput } from '~/generated/prisma/models';

/**
 * TODO:
 * - rausfinden, wie das read
 */

// TODO Create a new appointment
// validieren wir die einzelnen Felder im Frontend oder hier nochmal?
export async function createAppointment(appointment: Appointment): Promise<Appointment> {
  await validateReference(appointment.organizationId, appointment.employeeId);
  try {
    const createdAppointment = await prisma.appointment.create({
      data: appointment as AppointmentCreateInput,
    });
    return createdAppointment;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

// TODO Read all appointments (of what? organization/user/employee?)
// separate functions for each?
// export async function readAppointments(): Promise<Appointment[]> {}

async function validateReference(orgID: string, employeeID: string) {
  // check if organization exists
  if (!(await prisma.organization.findUnique({ where: { id: orgID } }))) {
    throw new ValidationError('notFound', 'organizationId', orgID);
  } // check if employee exists
  else if (!(await prisma.employee.findUnique({ where: { id: employeeID } }))) {
    throw new ValidationError('notFound', 'employeeId', employeeID);
  }
}
