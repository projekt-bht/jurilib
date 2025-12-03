import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ValidationError } from '@/error/validationErrors';
import { deleteOrganization, readOrganization, updateOrganization } from './services';

// GET /api/organization/:organizationID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      throw new ValidationError('invalidInput', 'organizationID', undefined, 400);
    }

    const organization = await readOrganization(organizationID);
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

// PATCH /api/organization/:organizationID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  // TODO: Authentifizierung
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      throw new ValidationError('invalidInput', 'content-type', undefined, 415);
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError('invalidInput', 'body', undefined, 400);
    }

    const { organizationID } = await params;
    if (!organizationID) {
      throw new ValidationError('invalidInput', 'organizationID', undefined, 400);
    }

    const updatedOrganization = await updateOrganization(body, organizationID);

    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: error.getErrorMessage(), field: error.field, value: error.value },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update organization: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

// DELETE /api/organization/:organizationID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  // TODO: Authentifizierung
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      throw new ValidationError('invalidInput', 'organizationID', undefined, 400);
    }
    await deleteOrganization(organizationID);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: error.getErrorMessage(), field: error.field, value: error.value },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete organization: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
