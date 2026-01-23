import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { handleValidationError, validateHeader } from '@/app/api/helper';

import { verifyJWT, verifyPasswordAndCreateJWT } from './JWTService';

const AccountLoginSchema = z.strictObject({
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8),
});

export async function POST(req: NextRequest) {
  try {
    validateHeader(req.headers);

    const body = AccountLoginSchema.parse(await req.json());
    const email = body.email;
    const password = body.password;

    //Create JWT for USER
    const jwtTokenString = await verifyPasswordAndCreateJWT(email, password);
    const loginRes = verifyJWT(jwtTokenString);

    const response = NextResponse.json(loginRes);

    //SET HTTP COOKIE
    response.cookies.set('access_token', jwtTokenString!, {
      httpOnly: true,
      expires: new Date(loginRes.exp * 1000),
      secure: true,
      sameSite: 'none',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const jwtString = _req.cookies.get('access_token')?.value;
    const loginRes = verifyJWT(jwtString);
    return NextResponse.json(loginRes, { status: 200 });
  } catch {
    const response = NextResponse.json(false, { status: 400 });
    response.cookies.delete('access_token');
    return response;
  }
}
export async function DELETE(_req: NextRequest) {
  const response = NextResponse.json({ status: 204 });
  response.cookies.delete('access_token');
  return response;
}
