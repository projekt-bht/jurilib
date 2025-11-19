import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import db from '@/lib/db';

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
    return NextResponse.json(matchedOrg);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

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


