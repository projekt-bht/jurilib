import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import type { Employee } from '~/generated/prisma/client';
import { Area, Gender, Language, Pronoun } from '~/generated/prisma/enums';

import { deleteEmployee, readEmployeeByEmployeeID, updateEmployee } from './services';

const UpdateSchemaEmployee = z.strictObject({
  id: z.string().min(36),
  //organizationId: z.string().optional(), // organizationId should not be updated, maybe later
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  pronoun: z.enum(Pronoun).optional(),
  pronounText: z.string().optional(),
  gender: z.enum(Gender).optional(),
  genderText: z.string().optional(),
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    const { employeeID } = await params;
    if (!employeeID) {
      return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
    }
    await deleteEmployee(employeeID);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete Employee: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
