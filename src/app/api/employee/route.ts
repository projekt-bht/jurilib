import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { handleError } from '@/app/api/helper';

// import { readAllEmployees } from './services';

// POTENTIAL ADMIN ENDPOINT
// // GET /api/employee
// // Returns a list of all employees in the database
// export async function GET(_req: NextRequest) {
//   try {
//     const employees = await readAllEmployees();
//     return NextResponse.json(employees, { status: 200 });
//   } catch (error) {
//     return handleError(error, 'Failed to read employees');
//   }
// }
