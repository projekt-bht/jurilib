import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Employee, Prisma } from '~/generated/prisma/client';
import type { EmployeeUncheckedCreateInput } from '~/generated/prisma/models';

// Create a new employee without a transaction
export const createEmployeeTx = async (
  employee: EmployeeUncheckedCreateInput,
  tx: Prisma.TransactionClient
): Promise<Employee> => {
  try {
    if (!employee) throw new ValidationError('invalidInput', 'employee', employee);
    if (!employee.accountId)
      throw new ValidationError('invalidInput', 'account', employee.accountId);
    if (!employee.organizationId)
      throw new ValidationError('invalidInput', 'organization', employee.organizationId);

    const createdEmployee = await tx.employee.create({
      data: {
        name: employee.name,
        phone: employee.phone,
        position: employee.position,
        expertiseArea: employee.expertiseArea,
        account: {
          connect: { id: employee.accountId },
        },
        organization: {
          connect: { id: employee.organizationId },
        },
      },
    });

    return createdEmployee;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

// Read all employees from the database
export const readAllEmployees = async (): Promise<Employee[]> => {
  try {
    const employees: Employee[] = await prisma.employee.findMany();
    if (!employees) {
      throw new ValidationError('notFound', 'employees', employees);
    }

    return employees;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
