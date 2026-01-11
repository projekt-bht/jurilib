import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { readServices } from './services';

// GET /api/organization/:organizationID/services
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationID: string }> }
) {
  try {
    const { organizationID } = await params;
    if (!organizationID) {
      return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
    }
    const services = await readServices(organizationID);
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
