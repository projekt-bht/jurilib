import prisma from '@/lib/db';
export async function isOrganizationEmployeeMatch(
  organizationID: string,
  employeeID: string
): Promise<boolean> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeID },
    });
    return employee?.organizationId === organizationID;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
}
