import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/browser';

// Read all appointments of a user
export async function readAllAppointmentsByCase(caseID: string): Promise<Appointment[]> {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { caseId: caseID },
    });
    return appointments;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database read failed: ' + (error as Error).message);
  }
}
