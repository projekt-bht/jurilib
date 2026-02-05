// GET /api/case/:caseID/documents?fileName=...
// Download a public blob from azure (accessible to both users and employees)

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleError, validateIds } from '@/app/api/helper';
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

// Download a specific public blob from azure (accessible to case user or employee)
export async function GET(req: NextRequest, { params }: { params: Promise<{ caseID: string }> }) {
  try {
    const { caseID } = await params;
    validateIds([{ id: caseID, identifier: 'caseID' }]);

    const fileName = req.nextUrl.searchParams.get('fileName');
    if (!fileName) {
      return NextResponse.json(
        { message: 'fileName query parameter is required' },
        { status: 400 }
      );
    }

    // Try to authenticate as either user or employee
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return handleError(error, 'Failed to download blob');
  }
}
