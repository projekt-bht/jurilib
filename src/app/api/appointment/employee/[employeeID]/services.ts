import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/client';
import type { AppointmentCreateInput } from '~/generated/prisma/models';

type ZodCreateAppointment = {
  organizationId: string;
  employeeId: string;
  dateTimeStart: string;
  duration: number;
};

// Create a new appointment
export async function createAppointment(
  employeeID: string,
  appointment: ZodCreateAppointment
): Promise<Appointment> {
  await validateReference(employeeID, appointment.employeeId, appointment.organizationId);

  /**
   * determine appointment end time based on start time and duration
   * end time ALWAYS has to be calculated, to avoid overlapping appointments
   * if duration is not provided, default to 30 minutes
   */
  const startTime = new Date(appointment.dateTimeStart);
  const endTime = new Date(startTime.getTime() + (appointment.duration ?? 30) * 60000);
  await validateNotOverlapping(startTime, endTime, appointment.employeeId);

  try {
    const createdAppointment = await prisma.appointment.create({
      data: {
        organizationId: appointment.organizationId,
        employeeId: appointment.employeeId,
        duration: appointment.duration,
        dateTimeStart: appointment.dateTimeStart,
        dateTimeEnd: endTime,
      } as AppointmentCreateInput,
    });
    return createdAppointment;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

// Read all appointments of an employee
export async function readAllAppointmentsByEmployee(employeeID: string): Promise<Appointment[]> {
  await validateReference(employeeID);

  try {
    const appointments = await prisma.appointment.findMany({
      where: { employeeId: employeeID },
    });
    return appointments;
  } catch (error) {
    throw new Error('Database read failed: ' + (error as Error).message);
  }
}

/**
 * ####################################################
 * ################# helper functions #################
 * ####################################################
 */

async function validateReference(paramEmployeeID: string, bodyEmployeeID?: string, orgID?: string) {
  // check if employee exists
  if (!(await prisma.employee.findUnique({ where: { id: paramEmployeeID } }))) {
    throw new ValidationError('notFound', 'employeeId', paramEmployeeID);
  }
  // check if param employeeID matches body employeeID
  else if (bodyEmployeeID && paramEmployeeID !== bodyEmployeeID) {
    throw new ValidationError('mismatch', 'employeeId', bodyEmployeeID);
  }
  // check if organization exists
  else if (orgID && !(await prisma.organization.findUnique({ where: { id: orgID } }))) {
    throw new ValidationError('notFound', 'organizationId', orgID);
  }
}

/**
 * Two time intervals A and B overlap if both of the following are true:
 *
 * 1. A starts before B ends
 *      A.start < B.end
 *
 * 2. A ends after B starts
 *      A.end > B.start
 *
 * This condition correctly identifies all types of overlaps:
 *  - partial overlap at the beginning
 *  - partial overlap at the end
 *  - one interval fully inside the other
 *
 * It also correctly excludes intervals that do NOT overlap:
 *  - A completely before B (A.end <= B.start)
 *  - A completely after B (A.start >= B.end)
 *
 * Using AND (not OR) is essential because both conditions must be true
 * for the intervals to intersect.
 */
export async function validateNotOverlapping(
  startTime: Date,
  endTime: Date,
  employeeId: string,
  appointmentID?: string
) {
  const overlappingAppointments = await prisma.appointment.findMany({
    where: {
      employeeId: employeeId,
      AND: [
        {
          dateTimeStart: { lt: endTime }, // A starts before B ends
        },
        {
          dateTimeEnd: { gt: startTime }, // A ends after B starts
        },
      ],
    },
  });

  if (overlappingAppointments.length === 1 && appointmentID) {
    // Appointment might be overlapping with itself
    if (overlappingAppointments[0].id !== appointmentID) {
      throw new ValidationError('overlappingAppointment', 'dateTimeStart', startTime, 400);
    }
  } else if (overlappingAppointments.length > 0) {
    throw new ValidationError('overlappingAppointment', 'dateTimeStart', startTime, 400);
  }
}
