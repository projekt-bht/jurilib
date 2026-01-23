import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { handleValidationError, validateIds } from '@/app/api/helper';

import { readEmployeesByOrganizationID } from './services';

// GET /api/employee/[organizationID]
// Returns all employees for a given organization ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    validateIds([{ id: organizationID, identifier: 'organizationID' }]);

    const employees = await readEmployeesByOrganizationID(organizationID);
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
