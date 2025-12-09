import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { login, verifyJWT, verifyPasswordAndCreateJWT } from './JWTService';

//TODO VALIDATE WITH ZOD - TOO LAZY RN

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }
    const body = await req.json();
    const email = body.email;
    const password = body.password;

    //Check if User exists
    await login(email, password);

    //Create JWT for USER
    const jwtTokenString = await verifyPasswordAndCreateJWT(email, password);
    const loginRes = verifyJWT(jwtTokenString);

    const response = NextResponse.json({ message: 'Login successful' });

    //SET HTTP COOKIE
    response.cookies.set('access_token', jwtTokenString!, {
      httpOnly: true,
      expires: new Date(loginRes.exp * 1000),
      secure: true,
      sameSite: 'none',
    });

    return response;
  } catch (error) {
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
  } catch (error) {
    const response = NextResponse.json(false, { status: 200 });
    response.cookies.delete('access_token');
    return response;
  }
}
export async function DELETE(_req: NextRequest) {
  const response = NextResponse.json({ status: 200 });
  response.cookies.delete('access_token');
  return response;
}
