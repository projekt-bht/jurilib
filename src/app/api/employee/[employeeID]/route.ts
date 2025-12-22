import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import type { Employee } from '~/generated/prisma/client';
import { Areas } from '~/generated/prisma/enums';

import { readEmployeeByEmployeeID, updateEmployee } from './services';

const UpdateSchemaEmployee = z.object({
  id: z.string().min(36),
  //organizationId: z.string().optional(), // organizationId should not be updated, maybe later
  name: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  expertiseAreas: z.array(z.enum(Areas)).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    const { employeeID } = await params;
    if (!employeeID) {
      return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
    }

    const employee = await readEmployeeByEmployeeID(employeeID);
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }
    const { employeeID } = await params;
    if (!employeeID) {
      return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const validatedBody = UpdateSchemaEmployee.parse(body);

    const updatedEmployee = await updateEmployee(validatedBody as Employee, employeeID);
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Problem: ' + (error as Error).message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update Employee: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * There is no DELETE endpoint for employee as employees are deleted through the account endpoint
 * when an account is deleted, which in turn calls the deleteEmployeeTx function in services.ts.
 * This ensures that all related data is cleaned up properly in a transaction.
 */
