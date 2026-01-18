import prisma from '@/lib/db';
import type { CaseUpdateInput } from '~/generated/prisma/models';

export async function updateCase(caseID: string, caseBody: CaseUpdateInput) {
  try {
    const updatedCase = await prisma.case.update({
      where: { id: caseID },
      data: caseBody,
    });
    return updatedCase;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

export async function deleteCase(caseID: string) {
  try {
    await prisma.case.delete({ where: { id: caseID } });
  } catch (error) {
    throw new Error('Case deletion failed: ' + (error as Error).message);
  }
}
