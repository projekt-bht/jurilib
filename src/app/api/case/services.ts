import prisma from '@/lib/db';
import type { CaseCreateInput } from '~/generated/prisma/models';

export type CaseCreateWithAppointmentInput = CaseCreateInput & {
  appointmentId: string;
};

export async function createCase(caseBody: CaseCreateInput) {
  try {
    const createdCase = await prisma.case.create({
      data: caseBody,
    });
    return createdCase;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

export async function createCaseWithAppointment(caseBody: CaseCreateWithAppointmentInput) {
  try {
    const { appointmentId, ...createCaseInput } = caseBody;
    const createdCase = await prisma.case.create({
      data: createCaseInput,
    });
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { caseId: caseBody.id },
    });
    return await prisma.case.findUnique({ where: { id: createdCase.id } });
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}
