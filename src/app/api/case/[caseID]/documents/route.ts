import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import type { LoginResource } from '@/services/Resources';

import { isCaseEmployeeMatch, isCaseUserMatch } from '../../helpers';
import { deleteBlob, getBlob } from './services';

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to download blob');
  }
}

// DELETE /api/case/:caseID/documents?fileName=...
// Delete a blob from azure and remove it from the case's documentsURL array
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ caseID: string }> }
) {
  try {
    const { caseID } = await params;
    validateIds([{ id: caseID, identifier: 'caseID' }]);

    // Try to authenticate as either user or employee
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return unauthorized();
    }

    const fileName = req.nextUrl.searchParams.get('fileName');
    const fileUri = req.nextUrl.toString().split('fileName=')[1];
    if (!fileName) {
      throw new ValidationError('missingRequiredValue', 'fileName', 400);
    }

    const loginResource: LoginResource = verifyJWT(token);

    const sasToken = process.env.AZURE_BLOB_SAS;
    const storageBaseURL = process.env.AZURE_STORAGE_BASE_URL;

    if (!sasToken || !storageBaseURL) {
      throw new Error('Azure configuration not set');
    }

    let isAuthorized = false;

    // Check if it's a user request
    if (loginResource.userId) {
      if (await isCaseUserMatch(caseID, loginResource.userId)) {
        isAuthorized = true;
      }
    }

    // Check if it's an employee request
    if (!isAuthorized && loginResource.employeeId) {
      if (await isCaseEmployeeMatch(caseID, loginResource.employeeId)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return unauthorized();
    }
    // Delete blob from Azure Storage and remove document URL from case
    await deleteBlob(caseID, fileName, fileUri);

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to delete blob');
  }
}
