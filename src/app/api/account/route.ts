import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { Role } from '~/generated/prisma/enums';

import { createAccount, readAccounts } from './services';

const CreateSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  role: z.enum(Role),
});

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();
    const data = CreateSchema.parse(body);
    const createdAccount = await createAccount(data);

    return NextResponse.json(createdAccount, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Problem: ' + (error as Error).message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const accounts = await readAccounts();
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
