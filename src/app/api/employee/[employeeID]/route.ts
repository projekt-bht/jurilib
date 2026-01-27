import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import { handleError, handleValidationError, validateHeader, validateIds } from '@/app/api/helper';
import type { Employee } from '~/generated/prisma/client';
import { Area, Gender, Language, Pronoun } from '~/generated/prisma/enums';

import { readEmployeeByEmployeeID, updateEmployee } from './services';

const UpdateSchemaEmployee = z.strictObject({
  //organizationId: z.string().optional(), // organizationId should not be updated, maybe later
  title: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  pronoun: z.enum(Pronoun).optional(),
  pronounText: z.string().optional(),
  gender: z.enum(Gender).optional(),
  genderText: z.string().optional(),
  imageUrl: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  description: z.string().optional(),
  languages: z.array(z.enum(Language)).optional(),
  expertiseAreas: z.array(z.enum(Area)).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    const { employeeID } = await params;
    validateIds([{ id: employeeID, identifier: 'employeeID' }]);

    const employee = await readEmployeeByEmployeeID(employeeID);
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return handleError(error, 'Failed to read Employee');
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    validateHeader(req.headers);

    const { employeeID } = await params;
    validateIds([{ id: employeeID, identifier: 'employeeID' }]);

    const body = await req.json();
    const validatedBody = UpdateSchemaEmployee.parse(body);

    const updatedEmployee = await updateEmployee(validatedBody as Employee, employeeID);
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return handleError(error, 'Failed to update Employee');
  }
}

/**
 * There is no DELETE endpoint for employee as employees are deleted through the account endpoint
 * when an account is deleted, which in turn calls the deleteEmployeeTx function in services.ts.
 * This ensures that all related data is cleaned up properly in a transaction.
 */
