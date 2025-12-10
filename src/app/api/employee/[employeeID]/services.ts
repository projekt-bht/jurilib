import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
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

// Delete an employee from the database by employeeID
export const deleteEmployee = async (employeeID: string): Promise<void> => {
  try {
    await prisma.employee.delete({ where: { id: employeeID } });
  } catch (error) {
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
