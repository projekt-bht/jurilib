import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';

import { getCasesByEmployee } from './services';

// GET /api/case/employee/:employeeID
// Show all cases from a single employee
export const GET = withEmployeeAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ employeeID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      // get employeeID from URL params to check if it's a valid uuid
      const { employeeID } = await params;
      validateIds([{ id: employeeID, identifier: 'employeeID' }]);

      if (!(employeeID === account.employeeId)) return unauthorized();

      const cases = await getCasesByEmployee(account.employeeId);
      return NextResponse.json(cases, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Failed to get cases by employee');
      }
    }
  }
);
