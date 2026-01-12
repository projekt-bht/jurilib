import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { readAccounts } from './services';

export async function GET(_req: NextRequest) {
  try {
    const accounts = await readAccounts();
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
