import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import { withUserAuth } from '@/lib/withAuth';
import type { UserLoginResource } from '@/services/Resources';

import { isCaseUserMatch } from '../../../helpers';
import { blobHeaderSchema } from '../route';
import { generateDocumentUrl, getBlob, updateDocumentArray, uploadBlob } from '../services';

// POST /api/case/:caseID/documents/user
// Upload a blob to azure as an user
export const POST = withUserAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ caseID: string }> },
    account: UserLoginResource
  ) => {
    try {
      const { private: privateFlag } = blobHeaderSchema.parse({
        private: req.headers.get('private'),
      });
      // validate URL Param
      const { caseID } = await params;
      validateIds([{ id: caseID, identifier: 'caseID' }]);

      if (await isCaseUserMatch(caseID, account.userId)) {
        // Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string;

        if (!file || !fileName) {
          throw new ValidationError('missingRequiredValue', 'file/fileName', 400);
        }

        // Convert file to base64
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        // Upload blob to Azure
        const uploadedBlob = await uploadBlob(
          caseID,
          fileName,
          fileBase64,
          privateFlag ? account.userId : undefined
        );

        // Generate the API-relative document URL
        const documentUrl = generateDocumentUrl(caseID, fileName, privateFlag, account.userId);
        await updateDocumentArray(caseID, documentUrl);

        return NextResponse.json(
          {
            name: uploadedBlob.name,
            documentUrl,
          },
          { status: 201 }
        );
      } else {
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Failed to upload blob');
      }
    }
  }
);

// GET /api/case/:caseID/documents/user?fileName=...
// Download a specific blob from azure as a user
export const GET = withUserAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ caseID: string }> },
    account: UserLoginResource
  ) => {
    try {
      const { private: privateFlag } = blobHeaderSchema.parse({
        private: req.headers.get('private'),
      });
      const { caseID } = await params;
      validateIds([{ id: caseID, identifier: 'caseID' }]);

      const fileName = req.nextUrl.searchParams.get('fileName');
      if (!fileName) {
        throw new ValidationError('missingRequiredValue', 'fileName', 400);
      }

      if (await isCaseUserMatch(caseID, account.userId)) {
        return await getBlob(caseID, fileName, privateFlag ? account.userId : undefined);
      } else {
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      }
      return handleError(error, 'Failed to download blob');
    }
  }
);
