import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Case } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/client';
import type { CaseCreateInput } from '~/generated/prisma/models';

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
    if (!appointment) {
      throw new ValidationError('notFound', 'appointment', appointmentId, 404);
    }
    // only continue, if userId is given!
    if (appointment.userId) {
      // get user information to
      const user = await prisma.user.findUnique({
        where: { id: appointment.userId },
      });
      if (!user) {
        throw new ValidationError('notFound', 'user', appointment.userId, 404);
      }
      const { firstname, lastname } = user;

      const caseCreationData: CaseCreateWithAppointmentInput = {
        title: `Fall zu ${firstname} ${lastname}`,
        description: `Neuer Fall vom ${new Date().toLocaleDateString()}`,
        employee: { connect: { id: employeeId } },
        appointmentId: appointmentId,
        user: { connect: { id: user.id } },
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

type CaseCreateWithAppointmentInput = CaseCreateInput & {
  appointmentId: string;
};

async function createCaseWithAppointment(caseBody: CaseCreateWithAppointmentInput) {
  try {
    const { appointmentId, ...createCaseInput } = caseBody;
    const createdCase = await prisma.case.create({
      data: createCaseInput,
    });
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { caseId: createdCase.id },
    });
    return createdCase;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}
