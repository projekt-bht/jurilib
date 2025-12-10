import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { verifyJWT } from './app/api/authentication/login/JWTService';

const requiresAuthRoutes = ['/api/dashboard'];
const optionalAuthRoutes = ['/api/authentication/login'];

export function proxy(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;
  if (requiresAuthRoutes.includes(pathname)) {
    return requiresAuthentication(request, response);
  } else if (optionalAuthRoutes.includes(pathname)) {
    return optionalAuthentication(request, response);
  }

  return NextResponse.next();
}

/**
 * https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d
 * Configure the scope of the middleware (example: everything expect -> _next/Static, _next/image etc.)
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function requiresAuthentication(req: NextRequest, res: NextResponse) {
  try {
    const loginRes = verifyJWT(req.cookies.get('access_token')?.value);
    const response = NextResponse.next();

    if (loginRes) {
      response.headers.set('userID', loginRes.id);
      response.headers.set('role', loginRes.role);
    }

    return response;
  } catch (err) {
    return NextResponse.next({ status: 401 });
  }
}

export function optionalAuthentication(req: NextRequest, res: NextResponse) {
  try {
    const jwtString = req.cookies.get('access_token')?.value;
    if (!jwtString) {
      return NextResponse.next();
    }

    const loginRes = verifyJWT(jwtString);
    const response = NextResponse.next();

    if (loginRes) {
      response.headers.set('userID', loginRes.id);
      response.headers.set('role', loginRes.role);
    }
    return response;
  } catch (err) {
    return NextResponse.next({ status: 401 });
  }
}
