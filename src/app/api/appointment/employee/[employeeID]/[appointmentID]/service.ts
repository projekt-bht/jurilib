import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/client';
import type { AppointmentStatus } from '~/generated/prisma/client';

import { validateNotOverlapping } from '../services';

type ZodUpdateAppointment = {
  serviceID?: string;
  duration?: number;
  status?: AppointmentStatus;
  location?: string;
  meetingLink?: string; // may require URL validation later
  dateTimeStart?: string;
  notes?: string;
};

// Read a specific appointment by ID
export async function readAppointment(
  employeeID: string,
  appointmentID: string
): Promise<Appointment> {
  try {
    const appointment = await validateReference(employeeID, appointmentID);
    return appointment;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
}

// Update an appointment by ID
export async function updateAppointment(
  employeeID: string,
  appointmentID: string,
  appointment: ZodUpdateAppointment
): Promise<Appointment> {
  try {
    const existingAppointment = await validateReference(employeeID, appointmentID);

    // Determine whether dateTimeEnd needs to be recalculated based on updated fields
    // only need to validate overlapping if dateTimeStart or duration is being updated
    if (appointment.dateTimeStart || appointment.duration) {
      const startTime = new Date(appointment.dateTimeStart ?? existingAppointment.dateTimeStart);
      const endTime = new Date(
        startTime.getTime() + (appointment.duration ?? existingAppointment.duration) * 60000
      );
      if (
        existingAppointment.dateTimeStart !== startTime ||
        existingAppointment.dateTimeEnd !== endTime
      ) {
        // Recalculate dateTimeEnd based on new dateTimeStart and duration
        await validateNotOverlapping(startTime, endTime, employeeID, appointmentID);
      }
    }

    // update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentID },
      data: {
        serviceId: appointment.serviceID ?? existingAppointment.serviceId ?? undefined,
        duration: appointment.duration ?? existingAppointment.duration,
        status: appointment.status ?? existingAppointment.status,
        location: appointment.location ?? existingAppointment.location ?? undefined,
        meetingLink: appointment.meetingLink ?? existingAppointment.meetingLink ?? undefined,
        dateTimeStart: appointment.dateTimeStart ?? existingAppointment.dateTimeStart,
        notes: appointment.notes ?? existingAppointment.notes ?? undefined,
      },
    });
    return updatedAppointment;
  } catch (error) {
    throw new Error('Database update failed: ' + (error as Error).message);
  }
}

// Delete an appointment by ID
export async function deleteAppointment(employeeID: string, appointmentID: string) {
  // TODO: hier später noch prüfen, welchen Status der Termin haben darf, um gelöscht zu werden
  // und ggf. Benachrichtigungen verschicken
  try {
    await validateReference(employeeID, appointmentID);
    await prisma.appointment.delete({ where: { id: appointmentID, employeeId: employeeID } });
  } catch (error) {
    throw new Error('Database delete failed: ' + (error as Error).message);
  }
}

export async function validateReference(paramEmployeeID: string, paramAppointmentID: string) {
  //check if employee exists
  if (!(await prisma.employee.findUnique({ where: { id: paramEmployeeID } }))) {
    throw new ValidationError('notFound', 'employeeId', paramEmployeeID);
  }
  // check if appointment exists
  const appointment = await prisma.appointment.findUnique({ where: { id: paramAppointmentID } });
  if (!appointment) {
    throw new ValidationError('notFound', 'appointmentId', paramAppointmentID);
  }

  return appointment;
}
