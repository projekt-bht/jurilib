import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

// GET /api/organization/:organizationID
// Get organization by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  const { organizationID } = await params;
  try {
    const matchedOrg = await db.organization.findUnique({ where: { id: organizationID } });
    if (!matchedOrg) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(matchedOrg, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/organization
// Create new organization
export async function POST(req: NextRequest) {
  const body = await req.json();
  const organizationInfo: OrganizationCreateInput = body;

  //TODO: Validierung
  const input = `
        ${organizationInfo.expertiseArea!.toString()}
      `;
  const expertiseVector = await vectorizeExpertiseArea(input);

  try {
    const createdOrganization = await db.organization.create({ data: organizationInfo });
    await db.$executeRawUnsafe(
      `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
      expertiseVector,
      createdOrganization.id
    );
    return NextResponse.json({ message: 'Created', createdOrganization }, { status: 201 });
  } catch (e) {
    throw e;
  }
}

// PATCH /api/organization
// Update organization by ID
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const organizationInfo: OrganizationCreateInput = body;

  //TODO: Validierung
  if (!organizationInfo.id) return NextResponse.json({ status: 400 });

  const input = `
        ${organizationInfo.expertiseArea!.toString()}
      `;
  const expertiseVector = await vectorizeExpertiseArea(input);

  try {
    const updatedOrganization = await db.organization.update({
      where: { id: organizationInfo.id },
      data: {
        ...organizationInfo,
      },
    });
    await db.$executeRawUnsafe(
      `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
      expertiseVector,
      updatedOrganization.id
    );
    return NextResponse.json({ message: 'Patched', updatedOrganization }, { status: 200 });
  } catch (e) {
    throw e;
  }
}

// DELETE /api/organization/:organizationID
// Delete organization by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  const { organizationID } = await params;
  try {
    await db.organization.delete({ where: { id: organizationID } });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Organization successfully deleted' }, { status: 200 });
}


