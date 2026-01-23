import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Employee } from '~/generated/prisma/client';

// Read all employees for a given organization ID
export const readEmployeesByOrganizationID = async (
  organizationID: string
): Promise<Employee[]> => {
  try {
    const employees: Employee[] = await prisma.employee.findMany({
      where: { organizationId: organizationID },
    });
    if (!employees) {
      throw new ValidationError('notFound', 'employees by organization ID', organizationID);
    }

    return employees;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
