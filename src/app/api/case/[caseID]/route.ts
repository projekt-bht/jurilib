import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { CaseStatus } from '~/generated/prisma/enums';
import type { CaseUpdateInput } from '~/generated/prisma/models';

import { verifyJWT } from '../../authentication/login/JWTService';
import { handleValidationError, validateHeader } from '../../helper';
import { deleteCase } from './services';
import { updateCase } from './services';

const paramsSchema = z.strictObject({
  caseID: z.uuid({ error: 'Case ID is required' }),
});
const caseUpdateSchema = z.strictObject({
  employeeId: z.uuid({ error: 'Employee ID is required' }).optional(),
  title: z.string('title is required').optional(),
  description: z.string('description is required').optional(),
  documentsURL: z.array(z.string()).optional(),
  status: z.enum(CaseStatus).optional(),
});

// PATCH /api/case/:caseID
// Update a case
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ caseID: string }> }) {
  // verify user is logged in
  const jwtString = req.cookies.get('access_token')?.value;
  const loginRes = verifyJWT(jwtString);
  if (loginRes.employeeId) {
    try {
      // validate URL Param
      const { caseID } = await params;
      paramsSchema.parse({ caseID });
      // validate header
      validateHeader(req.headers);
      // validate body
      const body = caseUpdateSchema.parse(await req.json());

      // handle update/patch
      const updatedCase = await updateCase(caseID, body);
      return NextResponse.json(updatedCase, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Update failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  } else {
    // unauthorized
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

// DELETE /api/case/:caseID
// Delete a case
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ caseID: string }> }
) {
  // verify user is logged in
  const jwtString = _req.cookies.get('access_token')?.value;
  const loginRes = verifyJWT(jwtString);
  if (loginRes.employeeId) {
    try {
      const { caseID } = await params;
      if (!caseID) {
        return NextResponse.json({ message: 'Case ID is required' }, { status: 400 });
      }
      await deleteCase(caseID);
      return NextResponse.json({ status: 204 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to delete organization: ' + (error as Error).message },
        { status: 400 }
      );
    }
  } else {
    // unauthorized
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
