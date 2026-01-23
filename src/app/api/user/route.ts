import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { readUsers } from './services';

export async function GET(_req: NextRequest) {
  try {
    const accounts = await readUsers();
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
