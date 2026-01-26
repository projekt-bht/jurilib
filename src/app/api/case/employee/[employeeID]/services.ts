import prisma from '@/lib/db';

export async function getCasesByEmployee(employeeID: string) {
  try {
    const cases = await prisma.case.findMany({
      where: { employeeId: employeeID },
    });
    return cases;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}
