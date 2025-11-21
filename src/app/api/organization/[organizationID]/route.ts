import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createOrganization, deleteOrganization, readOrganization, updateOrganization } from './services';

// GET /api/organization/:organizationID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
    }

    const organization = await readOrganization(organizationID);
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

// POST /api/organization/
export async function POST(req: NextRequest) {
  // TODO: Authentifizierung
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Request body is required' }, { status: 400 });
    }

    const createdOrganization = await createOrganization(body);
    return NextResponse.json(createdOrganization, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Creation failed: ' + (error as Error).message }, { status: 500 });
  }
}

// PATCH /api/organization/:organizationID
export async function PATCH(req: NextRequest) {
  // TODO: Authentifizierung
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Update data is required" }, { status: 400 });
    }
    const updatedOrganization = await updateOrganization(body);

    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update organization: " + (error as Error).message }, { status: 500 });
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
      return NextResponse.json({ message: "Organization ID is required" }, { status: 400 });
    }
    await deleteOrganization(organizationID);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete organization" + (error as Error).message }, { status: 500 });
  }

}


