// GET /api/appointment/:employeeID

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { isCaseEmployeeMatch, isCaseUserMatch } from '@/app/api/case/helpers';
import { handleError, handleZodError, unauthorized, validateIds } from '@/app/api/helper';
import type { LoginResource } from '@/services/Resources';

import { readAllAppointmentsByCase } from './services';

// Retrieve all appointments by case
export async function GET(req: NextRequest, { params }: { params: Promise<{ caseID: string }> }) {
  try {
    // Try to authenticate as either user or employee
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return unauthorized();
    }
    const loginResource: LoginResource = verifyJWT(token);
    const { caseID } = await params;
    validateIds([{ id: caseID, identifier: 'employeeID' }]);
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

    const appointments = await readAllAppointmentsByCase(caseID);
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Failed to read Appointments');
    }
  }
}
