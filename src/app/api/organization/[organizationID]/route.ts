import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import {
  handleError,
  handleZodError,
  unauthorized,
  validateHeader,
  validateIds,
} from '@/app/api/helper';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';

import { isOrganizationEmployeeMatch } from '../helpers';
import { deleteOrganization, readOrganization, updateOrganization } from './services';

// GET /api/organization/:organizationID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    validateIds([{ id: organizationID, identifier: 'organizationID' }]);

    const organization = await readOrganization(organizationID);
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to read organization');
  }
}

// PATCH /api/organization/:organizationID
export const PATCH = withEmployeeAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      validateHeader(req.headers);

      const body = await req.json();
      if (!body || Object.keys(body).length === 0) {
        return NextResponse.json({ message: 'Update data is required' }, { status: 400 });
      }

      const { organizationID } = await params;
      validateIds([{ id: organizationID, identifier: 'organizationID' }]);
      if (await isOrganizationEmployeeMatch(organizationID, account.employeeId)) {
        const updatedOrganization = await updateOrganization(body, organizationID);

        return NextResponse.json(updatedOrganization, { status: 200 });
      } else {
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      }
      return handleError(error, 'Failed to update organization');
    }
  }
);

// DELETE /api/organization/:organizationID
export const DELETE = withEmployeeAuth(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ organizationID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      const { organizationID } = await params;
      validateIds([{ id: organizationID, identifier: 'organizationID' }]);
      if (await isOrganizationEmployeeMatch(organizationID, account.employeeId)) {
        await deleteOrganization(organizationID);
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
      } else {
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      }
      return handleError(error, 'Failed to delete organization');
    }
  }
);
