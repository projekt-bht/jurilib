import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/browser';

// Read all appointments of an organization
export async function readAllAppointmentsByOrganization(
  organizationID: string
): Promise<Appointment[]> {
  await validateReference(organizationID);

  try {
    const appointments = await prisma.appointment.findMany({
      where: { organizationId: organizationID },
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

async function validateReference(organizationID: string) {
  // check if organization exists
  if (!(await prisma.organization.findUnique({ where: { id: organizationID } }))) {
    throw new ValidationError('notFound', 'organizationId', organizationID);
  }
}
