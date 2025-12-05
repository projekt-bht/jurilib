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
export async function createAppointment(appointment: ZodCreateAppointment): Promise<Appointment> {
  /**
   * determine appointment end time based on start time and duration
   * end time ALWAYS has to be calculated, to avoid overlapping appointments
   * if duration is not provided, default to 30 minutes
   */
  const startTime = new Date(appointment.dateTimeStart);
  const endTime = new Date(startTime.getTime() + (appointment.duration ?? 30) * 60000);
  await validateNotOverlapping(startTime, endTime, appointment.employeeId);

  await validateReference(appointment.organizationId, appointment.employeeId);

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
// TODO: implement

// Read a specific appointment by ID
// TODO: implement

// Update an appointment by ID
// TODO: implement

// Delete an appointment by ID
// TODO: implement

/**
 * ####################################################
 * ################# helper functions #################
 * ####################################################
 */

async function validateReference(orgID: string, employeeID: string) {
  // check if organization exists
  if (!(await prisma.organization.findUnique({ where: { id: orgID } }))) {
    throw new ValidationError('notFound', 'organizationId', orgID);
  } // check if employee exists
  else if (!(await prisma.employee.findUnique({ where: { id: employeeID } }))) {
    throw new ValidationError('notFound', 'employeeId', employeeID);
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
async function validateNotOverlapping(startTime: Date, endTime: Date, employeeId: string) {
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

  if (overlappingAppointments.length > 0) {
    throw new ValidationError('overlappingAppointment', 'dateTimeStart', startTime, 400);
  }
}
