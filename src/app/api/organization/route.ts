import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Areas, OrganizationType, PriceCategory } from '~/generated/prisma/client';

import { createOrganization, readOrganizations } from './services';

// Validate query params and drop unknown values to avoid invalid Prisma filters.
const parseEnumValues = <T extends Record<string, string>>(
  values: string[],
  enumObj: T
): T[keyof T][] =>
  values.filter((value): value is T[keyof T] =>
    Object.values(enumObj).includes(value as T[keyof T])
  );

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
// Retrieve all organizations
export async function GET(req: NextRequest) {
  try {
    // Extract filters from the query string so each UI change can request filtered data.
    const searchParams = req.nextUrl.searchParams;
    const priceCategory = parseEnumValues(searchParams.getAll('priceCategory'), PriceCategory);
    const organizationType = parseEnumValues(searchParams.getAll('organizationType'), OrganizationType);
    const specialties = parseEnumValues(searchParams.getAll('specialties'), Areas);
    const organization = await readOrganizations({
      priceCategory,
      organizationType,
      specialties,
    });
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
