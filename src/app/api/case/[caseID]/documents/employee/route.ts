import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, validateIds } from '@/app/api/helper';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';

import { isCaseEmployeeMatch } from '../../../helpers';
import { getBlob, uploadBlob } from '../services';

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
          return NextResponse.json({ message: 'File and fileName are required' }, { status: 400 });
        }

        // Convert file to base64
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        // Upload blob to Azure
        const uploadedBlob = await uploadBlob(caseID, fileName, fileBase64);

        return NextResponse.json(uploadedBlob, { status: 201 });
      } else {
        // unauthorized
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

// GET /api/case/:caseID/documents/employee?fileName=...
// Download a specific blob from azure as a employee, while not having access to private files
export const GET = withEmployeeAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ caseID: string }> },
    account: EmployeeLoginResource
  ) => {
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

      if (await isCaseEmployeeMatch(caseID, account.employeeId)) {
        return await getBlob(caseID, fileName);
      } else {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return handleError(error, 'Failed to download blob');
    }
  }
);
