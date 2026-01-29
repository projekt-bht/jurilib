import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/browser';

// Read all appointments of an organization
export async function readAllAppointmentsByOrganization(
  organizationID: string
): Promise<Appointment[]> {
  await validateReference(organizationID);

  try {
    // const appointments = await prisma.appointment.findMany({
    //   where: { organizationId: organizationID },
    // });

    // Instead of getting appointments through organization,
    // we get them through employees that belong to the organization
    const appointments = await prisma.appointment.findMany({
      where: {
        employee: {
          organizationId: organizationID,
        },
      },
    });

    return appointments;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database read failed: ' + (error as Error).message);
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
    throw new ValidationError('notFound', 'organizationId', organizationID, 404);
  }
}
