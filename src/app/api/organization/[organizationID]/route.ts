import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/openRouter/vectorizer';
import type { Organization } from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/internal/prismaNamespaceBrowser';

import { createOrganization, readOrganization } from './services';
import { checkRequiredFields } from './utils';

// GET /api/organization/:organizationID
// Get organization by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  const { organizationID } = await params;

  if (!organizationID) {
    return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
  }

  try {
    const organization = await readOrganization(organizationID);
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

// POST /api/organization
// Create new organization
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newOrganizationData: Organization = body;

  if (!newOrganizationData) {
    return NextResponse.json({ message: 'Creation data is required' }, { status: 400 });
  }

  // Gemeinsamer try catch-Block für Validierung und Erstellung
  // Wenn Fehlerklassen implementiert sind
  try {
    checkRequiredFields(newOrganizationData);
  } catch (error) {
    throw NextResponse.json({ message: 'Validation failed: ' + (error as Error).message }, { status: 400 });
  }

  try {
    const createdOrganization = await createOrganization(newOrganizationData);
    return NextResponse.json(createdOrganization, { status: 201 });
  } catch (error) {
    throw NextResponse.json({ message: 'Creation failed: ' + (error as Error).message }, { status: 500 });
  }
}

// PATCH /api/organization
// Update organization by ID
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const organizationInfo: OrganizationCreateInput = body;

  //TODO: Validierung und Autentifizierung
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
  // TODO: Validierung und Autenntifizierung
  const { organizationID } = await params;
  try {
    await db.organization.delete({ where: { id: organizationID } });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Organization successfully deleted' }, { status: 200 });
}


