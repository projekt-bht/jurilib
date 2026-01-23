import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { CaseStatus } from '~/generated/prisma/enums';
import type { CaseCreateInput } from '~/generated/prisma/models';

import { verifyJWT } from '../authentication/login/JWTService';
import { handleValidationError, validateHeader } from '../helper';
import { createCase } from './services';

const caseCreateSchema = z.strictObject({
  employeeId: z.uuid('Employee ID is required'),
  title: z.string('title is required'),
  description: z.string('description is required'),
  documentsURL: z.array(z.string()).default([]),
  status: z.enum(CaseStatus).default(CaseStatus.OPEN),
});

// POST /api/case/
// Create a new case manually without any appointments
export async function POST(req: NextRequest) {
  try {
    // validate header
    validateHeader(req.headers);
    // verify employee is logged in
    const jwtString = req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (loginRes.employeeId) {
      // validate body
      const body = caseCreateSchema.parse(await req.json());
      // links to existing Employee
      const caseInput: CaseCreateInput = {
        title: body.title,
        description: body.description,
        status: body.status,
        documentsURL: body.documentsURL ?? [],
        employee: {
          connect: { id: body.employeeId },
        },
      };

      const createdAppointment = await createCase(caseInput);
      return NextResponse.json(createdAppointment, { status: 201 });
    } else {
      // unauthorized
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    } else {
      return NextResponse.json(
        { message: 'Creation failed: ' + (error as Error).message },
        { status: 400 }
      );
    }
  }
}
