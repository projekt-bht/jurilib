import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';
import { handleError, handleZodError, validateHeader, validateIds } from '@/app/api/helper';
import { CaseStatus } from '~/generated/prisma/enums';

import { verifyJWT } from '../../authentication/login/JWTService';
import { isCaseEmployeeMatch } from '../helpers';
import { deleteCase } from './services';
import { updateCase } from './services';

const caseUpdateSchema = z.strictObject({
  employeeId: z.uuid({ error: 'Employee ID is required' }).optional(),
  title: z.string('title is required').optional(),
  description: z.string('description is required').optional(),
  documentsURL: z.array(z.string()).optional(),
  status: z.enum(CaseStatus).optional(),
});

// PATCH /api/case/:caseID
// Update a case
export const PATCH = withEmployeeAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ caseID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      // validate URL Param
      const { caseID } = await params;
      validateIds([{ id: caseID, identifier: 'caseID' }]);

      if (await isCaseEmployeeMatch(caseID, account.employeeId)) {
        // validate header
        validateHeader(req.headers);
        // validate body
        const body = caseUpdateSchema.parse(await req.json());

        // handle update/patch
        const updatedCase = await updateCase(caseID, body);
        return NextResponse.json(updatedCase, { status: 200 });
      } else {
        // unauthorized
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Failed to update Case');
      }
    }
  }
);

// DELETE /api/case/:caseID
// Delete a case
export const DELETE = withEmployeeAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ caseID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      const { caseID } = await params;
      validateIds([{ id: caseID, identifier: 'caseID' }]);
      if (await isCaseEmployeeMatch(caseID, account.employeeId)) {
        await deleteCase(caseID);
        return NextResponse.json({ status: 204 });
      } else {
        // unauthorized
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      }
      return handleError(error, 'Failed to delete Case');
    }
  }
);
