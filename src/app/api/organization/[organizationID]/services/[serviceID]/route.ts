import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { handleValidationError, validateHeader } from '@/app/api/helper';
import { PricingModel, ServiceType } from '~/generated/prisma/enums';

import { deleteService } from './services';
import { updateService } from './services';

const paramsSchema = z.strictObject({
  serviceID: z.uuid({ error: 'Case ID is required' }),
});
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
  { params }: { params: Promise<{ serviceID: string }> }
) {
  // verify employee is logged in
  const jwtString = req.cookies.get('access_token')?.value;
  const loginRes = verifyJWT(jwtString);
  if (loginRes.employeeId) {
    try {
      // validate URL Param
      const { serviceID } = await params;
      paramsSchema.parse({ serviceID });
      // validate header
      validateHeader(req.headers);
      // validate body
      const body = serviceUpdateSchema.parse(await req.json());

      // handle update/patch
      const updatedCase = await updateService(serviceID, body);
      return NextResponse.json(updatedCase, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Update failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  } else {
    // unauthorized
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

// DELETE /api/organization/:organizationID/services/:serviceID
// Delete a service
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceID: string }> }
) {
  // verify employee is logged in
  const jwtString = _req.cookies.get('access_token')?.value;
  const loginRes = verifyJWT(jwtString);
  if (loginRes.employeeId) {
    try {
      const { serviceID } = await params;
      if (!serviceID) {
        return NextResponse.json({ message: 'Case ID is required' }, { status: 400 });
      }
      await deleteService(serviceID);
      return NextResponse.json({ status: 204 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to delete organization: ' + (error as Error).message },
        { status: 400 }
      );
    }
  } else {
    // unauthorized
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
