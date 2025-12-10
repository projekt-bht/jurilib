import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { readEmployeesByOrganizationID } from './services';

// GET /api/employee/[organizationID]
// Returns all employees for a given organization ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
    }

    const employees = await readEmployeesByOrganizationID(organizationID);
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
