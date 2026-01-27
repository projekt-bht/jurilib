import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleError, handleZodError, validateHeader } from '@/app/api/helper';
import { Area, OrganizationType, PriceCategory } from '~/generated/prisma/client';

import { createOrganization, readOrganizations } from './services';

/**
 * Validate parameters
 * defaults to skip=0 & take=10 even if the values are nullish
 */
// const paramsSchema = z.object({
const paramsSchema = z.strictObject({
  skip: z.preprocess(
    (v) => (v === null || v === undefined ? undefined : Number(v)),
    z.int().nonnegative().default(0)
  ),
  take: z.preprocess(
    (v) => (v === null || v === undefined ? undefined : Number(v)),
    z.int().nonnegative().max(100, 'Take can not be more than 100').default(10)
  ),
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
    validateHeader(req.headers);

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Request body is required' }, { status: 400 });
    }

    const createdOrganization = await createOrganization(body);
    return NextResponse.json(createdOrganization, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleError(error, 'Creation failed');
  }
}

// GET /api/organization/
// Retrieve all organizations considering given query parameters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    // pagination
    // values can be null and need to be validated later on
    const skip = searchParams.get('skip');
    const take = searchParams.get('take');
    // filter
    // values will always be an array
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
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    } else {
      return handleError(error, 'Read failed');
    }
  }
}
