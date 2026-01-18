import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createService, readServices } from './services';
import { z } from 'zod';
import { handleValidationError, validateHeader } from '@/app/api/helper';
import { ServiceCreateInput } from '~/generated/prisma/models';
import { PricingModel, ServiceType } from '~/generated/prisma/enums';
import { verifyJWT } from '@/app/api/authentication/login/JWTService';

// GET /api/organization/:organizationID/services
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
    }
    const services = await readServices(organizationID);
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

const serviceCreateSchema = z.strictObject({
  description: z.string('description is required'),
  type: z.enum(ServiceType),
  //pricing Model defaults to "FIXED" via DB
  pricingModel: z.enum(PricingModel).optional(),
  price: z.float64(),
  //duration defaults to 30 minutes via DB
  defaultDuration: z.int().optional(),
});

const paramsSchema = z.strictObject({
  organizationID: z.uuid({ error: 'Organization ID is required' }),
});

// POST /api/case/
// Create a new case manually without any appointments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  // verify employee is logged in
  const jwtString = req.cookies.get('access_token')?.value;
  const loginRes = verifyJWT(jwtString);
  if (loginRes.employeeId) {
    try {
      // validate header
      validateHeader(req.headers);
      // validate params
      const { organizationID } = await params;
      paramsSchema.parse({ organizationID });
      // validate body
      const body = serviceCreateSchema.parse(await req.json());
      // links to existing Organization
      // title defaults to type of service
      const serviceInput: ServiceCreateInput = {
        title: body.type,
        description: body.description,
        type: body.type,
        pricingModel: body.pricingModel,
        price: body.price,
        defaultDuration: body.defaultDuration,
        organization: { connect: { id: organizationID } },
      };

      const createdAppointment = await createService(serviceInput);
      return NextResponse.json(createdAppointment, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      } else {
        return NextResponse.json(
          { message: 'Creation failed: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  } else {
    // unauthorized
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
