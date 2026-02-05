import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';

import { isCaseEmployeeMatch } from '../../../helpers';
import { generateDocumentUrl, updateDocumentArray, uploadBlob } from '../services';

// POST /api/case/:caseID/documents/employee
// Upload a blob to azure as an employee
export const POST = withEmployeeAuth(
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
        // Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string;

        if (!file || !fileName) {
          throw new ValidationError(
            'invalidInput',
            'file/fileName',
            `File: ${file}, FileName: ${fileName}`,
            400
          );
        }

        // Convert file to base64
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        // Upload blob to Azure (no private flag for employees, always public)
        const uploadedBlob = await uploadBlob(caseID, fileName, fileBase64);

        // Generate the API-relative document URL (public, not private)
        const documentUrl = generateDocumentUrl(caseID, fileName, false);
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
