import prisma from '@/lib/db';
export async function isCaseEmployeeMatch(caseID: string, employeeID: string): Promise<boolean> {
  try {
    const caseToCheck = await prisma.case.findUnique({
      where: { id: caseID },
    });
    return caseToCheck?.employeeId === employeeID;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
}
