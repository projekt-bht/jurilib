import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment, AppointmentStatus } from '~/generated/prisma/client';

// Read a specific appointment by ID
export async function readAppointment(userID: string, appointmentID: string): Promise<Appointment> {
  try {
    const appointment = await validateReference(userID, appointmentID);
    return appointment;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
}

// Update an appointment by ID
export async function updateAppointment(
  userID: string,
  appointmentID: string,
  status: AppointmentStatus | undefined
): Promise<Appointment> {
  try {
    const existingAppointment = await validateReference(userID, appointmentID);

    // update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentID },
      data: {
        status: status ?? existingAppointment.status,
      },
    });
    return updatedAppointment;
  } catch (error) {
    throw new Error('Database update failed: ' + (error as Error).message);
  }
}

// delete an appointment by ID
export async function deleteAppointment(userID: string, appointmentID: string): Promise<void> {
  // TODO: hier später noch prüfem, welchen Status der Termin haben darf, um gelöscht zu werden
  // und ggf. Benachrichtugungen verschicken
  try {
    await validateReference(userID, appointmentID);
    await prisma.appointment.delete({
      where: { id: appointmentID },
    });
  } catch (error) {
    throw new Error('Database delete failed: ' + (error as Error).message);
  }
}

async function validateReference(paramUserID: string, paramAppointmentID: string) {
  // check if user exists
  if (!(await prisma.user.findUnique({ where: { id: paramUserID } }))) {
    throw new ValidationError('notFound', 'userID', paramUserID);
  }
  // check if appointment exists
  const appointment = await prisma.appointment.findUnique({ where: { id: paramAppointmentID } });
  if (!appointment) {
    throw new ValidationError('notFound', 'appointmentID', paramAppointmentID);
  }
  // check if appointment belongs to user
  if (appointment.userId !== paramUserID) {
    throw new ValidationError('mismatch', 'appointmentID', paramAppointmentID);
  }
  return appointment;
}
