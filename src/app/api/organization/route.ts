import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createOrganization, readOrganizations } from './services';
import { Areas, Organization } from '~/generated/prisma/client';
import { areaValuesToKeys } from '@/lib/utils';

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

    const body: Organization = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Request body is required' }, { status: 400 });
    }

    //manipulate expertiseArea to match correct Key
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
export async function GET(_req: NextRequest) {
  try {
    const organization = await readOrganizations();
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
