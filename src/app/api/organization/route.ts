import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { vectorizeExpertiseArea } from 'src/services/server/vectorizer';

import prisma from '@/lib/db';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const organizationInfo: OrganizationCreateInput = body;

  //TODO: Validierung
  const input = `
        ${organizationInfo.expertiseArea!.toString()}
      `;
  const expertiseVector = await vectorizeExpertiseArea(input);

  try {
    const createdOrganization = await prisma.organization.create({ data: organizationInfo });
    await prisma.$executeRawUnsafe(
      `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
      expertiseVector,
      createdOrganization.id
    );
    return NextResponse.json({ message: 'Created' }, { status: 201 });
  } catch (e) {
    throw e;
  }
}

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
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationInfo.id },
      data: {
        ...organizationInfo,
      },
    });
    await prisma.$executeRawUnsafe(
      `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
      expertiseVector,
      updatedOrganization.id
    );
    return NextResponse.json({ message: 'Patched' }, { status: 200 });
  } catch (e) {
    throw e;
  }
}

export async function GET(_req: NextRequest) {
  try {
    const organizations = await prisma.organization.findMany();
    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
