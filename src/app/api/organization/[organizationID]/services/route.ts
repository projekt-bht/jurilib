import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  handleError,
  handleZodError,
  unauthorized,
  validateHeader,
  validateIds,
} from '@/app/api/helper';
import { withEmployeeAuth } from '@/lib/withAuth';
import type { EmployeeLoginResource } from '@/services/Resources';
import { PricingModel, ServiceType } from '~/generated/prisma/enums';
import type { ServiceCreateInput } from '~/generated/prisma/models';

import { isOrganizationEmployeeMatch } from '../../helpers';
import { createService, readServices } from './services';

const serviceCreateSchema = z.strictObject({
  description: z.string('description is required'),
  type: z.enum(ServiceType),
  //pricing Model defaults to "FIXED" via DB
  pricingModel: z.enum(PricingModel).optional(),
  price: z.float64(),
  //duration defaults to 30 minutes via DB
  defaultDuration: z.int().optional(),
});

// GET /api/organization/:organizationID/services
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    validateIds([{ id: organizationID, identifier: 'organizationID' }]);

    const services = await readServices(organizationID);
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Failed to read Services');
  }
}

// POST /api/organization/:organizationID/services
// Create a new case manually without any appointments
export const POST = withEmployeeAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationID: string }> },
    account: EmployeeLoginResource
  ) => {
    try {
      // validate header
      validateHeader(req.headers);
      // validate params
      const { organizationID } = await params;
      validateIds([{ id: organizationID, identifier: 'organizationID' }]);
      if (await isOrganizationEmployeeMatch(organizationID, account.employeeId)) {
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
      } else {
        // unauthorized
        return unauthorized();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error);
      } else {
        return handleError(error, 'Creation failed');
      }
    }
  }
);
