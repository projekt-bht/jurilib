import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import { validateHeader } from '../helper';
import { readAccounts, updatePasswordWithEmail } from './services';

const UpdateSchema = z.strictObject({
  email: z.email(),
  password: z.string().min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8),
});

export async function GET(_req: NextRequest) {
  try {
    const accounts = await readAccounts();
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    validateHeader(req.headers);

    // validate body
    const body = await req.json();
    const data = UpdateSchema.parse(body);
    await updatePasswordWithEmail(data.email, data.password);

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Problem: ' + (error as Error).message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update account: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
