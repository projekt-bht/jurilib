import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Prisma } from '~/generated/prisma/browser';
import type { Employee } from '~/generated/prisma/client';

// Read a single employee from the database by employeeID
export const readEmployeeByEmployeeID = async (employeeID: string): Promise<Employee> => {
  try {
    const employee: Employee | null = await prisma.employee.findUnique({
      where: { id: employeeID },
    });
    if (!employee) {
      throw new ValidationError('notFound', 'employees', employeeID);
    }
    return employee;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

// Update an existing employee in the database by employeeID
export const updateEmployee = async (employee: Employee, employeeID: string): Promise<Employee> => {
  try {
    const existingEmployee = await prisma.employee.findUnique({ where: { id: employeeID } });
    if (!existingEmployee) {
      throw new ValidationError('notFound', 'employees', employeeID);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeID },
      data: {
        ...employee,
      },
    });

    return updatedEmployee;
  } catch (error) {
    throw new Error('Database update failed' + (error as Error).message);
  }
};

/**
 * Delete an employee from the database by accountID within a transaction
 * This function is always called through the account endpoint when an account is deleted.
 */
export const deleteEmployeeTx = async (
  accountID: string,
  tx: Prisma.TransactionClient
): Promise<void> => {
  try {
    // validate accountID
    if (!accountID) throw new ValidationError('invalidInput', 'accountID', accountID);
    // find employee by accountID
    const employee = await tx.employee.findUnique({ where: { accountId: accountID } });
    if (!employee) throw new ValidationError('notFound', 'employee', accountID);
    // delete employee
    await tx.employee.delete({ where: { id: employee.id } });
  } catch (error) {
    throw new Error('Internal Server Error while deleting employee: ' + (error as Error).message);
  }
};
