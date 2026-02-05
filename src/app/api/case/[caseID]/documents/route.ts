import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import type { LoginResource } from '@/services/Resources';

import { isCaseEmployeeMatch, isCaseUserMatch } from '../../helpers';
import { getBlob } from './services';

/**
 * Validate the 'private'-flag of the request header is a boolean value or undefined
 */
export const blobHeaderSchema = z.object({
  private: z
    .enum(['true', 'false'])
    .nullable()
    .default('false')
    .transform((val) => val === 'true'),
});

// GET /api/case/:caseID/documents?fileName=...
// Download a public public blob from azure (accessible to both users and employees)
export async function GET(req: NextRequest, { params }: { params: Promise<{ caseID: string }> }) {
  try {
    const { caseID } = await params;
    validateIds([{ id: caseID, identifier: 'caseID' }]);

    // Try to authenticate as either user or employee
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return unauthorized();
    }

    const fileName = req.nextUrl.searchParams.get('fileName');
    if (!fileName) {
      throw new ValidationError('missingRequiredValue', 'fileName', 400);
    }

    try {
      const loginResource: LoginResource = verifyJWT(token);

      // Check if it's a user request
      if (loginResource.userId) {
        if (await isCaseUserMatch(caseID, loginResource.userId)) {
          return await getBlob(caseID, fileName);
        }
      }

      // Check if it's an employee request
      if (loginResource.employeeId) {
        if (await isCaseEmployeeMatch(caseID, loginResource.employeeId)) {
          return await getBlob(caseID, fileName);
        }
      }

      // If neither user nor employee match, unauthorized
      return unauthorized();
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to download blob');
  }
}
