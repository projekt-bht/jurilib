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

// implemented for later use
export async function isCaseUserMatch(caseID: string, userID: string): Promise<boolean> {
  try {
    const caseToCheck = await prisma.case.findUnique({
      where: { id: caseID },
    });
    return caseToCheck?.userId === userID;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
}
