import {
  type CaseCreateWithAppointmentInput,
  createCaseWithAppointment,
} from '@/app/api/case/services';
import prisma from '@/lib/db';
import type { Case } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/client';

// Book an appointment by Id
export async function confirmAppointmentCreateCase(
  appointmentId: string,
  employeeId: string
): Promise<Case> {
  try {
    // check if appointment already has a userId
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    // only continue, if userId is given!
    if (appointment?.userId) {
      // get user information to
      const user = await prisma.user.findUnique({
        where: { id: appointment.userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const { firstname, lastname } = user;

      const caseCreationData: CaseCreateWithAppointmentInput = {
        title: `Fall zu ${firstname} ${lastname}`,
        description: `Neuer Fall vom ${new Date().toLocaleDateString()}`,
        employee: { connect: { id: employeeId } },
        appointmentId: appointmentId,
      };
      const createdCase = await createCaseWithAppointment(caseCreationData);
      // confirm appointment
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.CONFIRMED,
        },
      });
      const returnCase = {
        ...createdCase,
        appointment: updatedAppointment,
      };
      return returnCase;
    }
    throw new Error('Appointment is not assigned to any user');
  } catch (error) {
    throw new Error('Database update failed: ' + (error as Error).message);
  }
}
