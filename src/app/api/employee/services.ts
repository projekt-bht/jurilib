import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Employee } from '~/generated/prisma/client';
import type { EmployeeCreateInput } from '~/generated/prisma/models';

// Create a new employee in the database
export const createEmployee = async (
  employee: EmployeeCreateInput,
  accountID: string
): Promise<Employee> => {
  try {
    if (!employee) throw new ValidationError('invalidInput', 'employee', employee);
    if (!accountID) throw new ValidationError('invalidInput', 'account', accountID);

    const createdEmployee = await prisma.employee.create({
      data: {
        ...employee,
        account: {
          connect: { id: accountID },
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
