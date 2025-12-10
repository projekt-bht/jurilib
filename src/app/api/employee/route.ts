import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { readAllEmployees } from './services';

// GET /api/employee
// Returns a list of all employees in the database
export async function GET(_req: NextRequest) {
  try {
    const employees = await readAllEmployees();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
