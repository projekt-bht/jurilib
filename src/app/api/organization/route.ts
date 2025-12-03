import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ValidationError } from '@/error/validationErrors';
import { createOrganization, readOrganizations } from './services';

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
      throw new ValidationError('invalidInput', 'content-type', undefined, 415);
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError('invalidInput', 'body', undefined, 400);
    }

    const createdOrganization = await createOrganization(body);
    return NextResponse.json(
      {
        message: 'Organisation erfolgreich registriert',
        organization: {
          id: createdOrganization.id,
          name: createdOrganization.name,
          email: createdOrganization.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: error.getErrorMessage(), field: error.field, value: error.value },
        { status: error.statusCode }
      );
    }
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
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: error.getErrorMessage(), field: error.field, value: error.value },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
