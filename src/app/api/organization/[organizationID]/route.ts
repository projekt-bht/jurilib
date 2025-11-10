import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  const { organizationID } = await params;
  const matchedOrg = await db.organization.findUnique({ where: { id: organizationID } });
  return NextResponse.json(matchedOrg);
}
