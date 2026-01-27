import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleError, handleZodError, validateHeader, validateIds } from '@/app/api/helper';
import { PricingModel, ServiceType } from '~/generated/prisma/enums';

import { isOrganizationEmployeeMatch } from '../helpers';
import { deleteService } from './services';
import { updateService } from './services';

const serviceUpdateSchema = z.strictObject({
  title: z.string('title is required').optional(),
  description: z.string('description is required').optional(),
  type: z.enum(ServiceType).optional(),
  pricingModel: z.enum(PricingModel).optional(),
  price: z.float64().optional(),
  defaultDuration: z.int().optional(),
});

// PATCH /api/organization/:organizationID/services/:serviceID
// Update a service
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serviceID: string; organizationID: string }> }
) {
  try {
    // validate URL Param
    const { serviceID, organizationID } = await params;
    validateIds([
      { id: serviceID, identifier: 'serviceID' },
      { id: organizationID, identifier: 'organizationID' },
    ]);
    // verify employee is logged in
    const jwtString = req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (
      loginRes.employeeId &&
      (await isOrganizationEmployeeMatch(organizationID, loginRes.employeeId))
    ) {
      // validate header
      validateHeader(req.headers);
      // validate body
      const body = serviceUpdateSchema.parse(await req.json());

      // handle update/patch
      const updatedCase = await updateService(serviceID, body);
      return NextResponse.json(updatedCase, { status: 200 });
    } else {
      // unauthorized
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Service update failed');
    }
  }
}

// DELETE /api/organization/:organizationID/services/:serviceID
// Delete a service
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceID: string; organizationID: string }> }
) {
  try {
    const { serviceID, organizationID } = await params;
    validateIds([
      { id: serviceID, identifier: 'serviceID' },
      { id: organizationID, identifier: 'organizationID' },
    ]);
    // verify employee is logged in
    const jwtString = _req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    if (
      loginRes.employeeId &&
      (await isOrganizationEmployeeMatch(organizationID, loginRes.employeeId))
    ) {
      await deleteService(serviceID);
      return NextResponse.json({ status: 204 });
    } else {
      // unauthorized
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to delete organization');
  }
}
