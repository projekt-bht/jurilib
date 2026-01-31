import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';

import { getCasesByEmployee } from './services';

// GET /api/case/employee/:employeeID
// Show all cases from a single employee
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ employeeID: string }> }
) {
  try {
    // get employeeId from Header
    const employeeId = req.headers.get('employeeID');
    if (!employeeId) return unauthorized();

    // get employeeID from URL params to check if it's a valid uuid
    const { employeeID } = await params;
    validateIds([{ id: employeeID, identifier: 'employeeID' }]);

    const cases = await getCasesByEmployee(employeeId);
    return NextResponse.json(cases, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to get cases by employee');
    }
  }
}
