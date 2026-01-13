import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { Area, OrganizationType, PriceCategory } from '~/generated/prisma/client';

import { createOrganization, readOrganizations } from './services';

/**
 * Validate parameters
 * defaults to skip=0 & take=10
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  skip: z.int().nonnegative().default(0),
  take: z.int().nonnegative().max(100, 'Take can not be more than 100').default(10),
  priceCategory: z.array(z.enum(PriceCategory)),
  organizationType: z.array(z.enum(OrganizationType)),
  area: z.array(z.enum(Area)),
});

/*
TODO:
- Errorhandling implementieren
- Authentifizierung hinzufügen
*/

// POST /api/organization/
// Create a new organization
export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Request body is required' }, { status: 400 });
    }

    const createdOrganization = await createOrganization(body);
    return NextResponse.json(createdOrganization, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

// GET /api/organization/
// Retrieve all organizations considering given query parameters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const skip = Number(searchParams.get('skip'));
    const take = Number(searchParams.get('take'));
    // Extract filters from the query string so each UI change can request filtered data.
    const priceCategory = searchParams.getAll('priceCategory');
    const organizationType = searchParams.getAll('organizationType');
    const area = searchParams.getAll('area');

    const validatedParams = paramsSchema.parse({
      skip: skip,
      take: take,
      priceCategory: priceCategory,
      organizationType: organizationType,
      area: area,
    });

    const organization = await readOrganizations(validatedParams);
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
