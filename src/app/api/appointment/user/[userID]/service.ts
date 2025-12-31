import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/browser';

// Read all appointments of a user
export async function readAllAppointmentsByUser(userID: string): Promise<Appointment[]> {
  await validateReference(userID);

  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: userID },
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

async function validateReference(userID: string) {
  // check if user exists
  if (!(await prisma.user.findUnique({ where: { id: userID } }))) {
    throw new ValidationError('notFound', 'userId', userID);
  }
}
