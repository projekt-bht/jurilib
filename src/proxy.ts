import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { verifyJWT } from './app/api/authentication/login/JWTService';

export function proxy(request: NextRequest, response: NextResponse) {
  return optionalAuthentication(request, response);
}

/**
 * https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d
 * Configure the scope of the middleware (example: everything expect -> _next/Static, _next/image etc.)
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function optionalAuthentication(req: NextRequest, _res: NextResponse) {
  try {
    const jwtString = req.cookies.get('access_token')?.value;
    if (!jwtString) {
      return NextResponse.next();
    }

    const loginRes = verifyJWT(jwtString);
    const response = NextResponse.next();

    // check if userId or employeeId exists
    if (loginRes.userId) response.headers.set('userID', loginRes.userId);
    if (loginRes.employeeId) response.headers.set('employeeId', loginRes.employeeId);
    // set accountID and account type anyways
    response.headers.set('ID', loginRes.id);
    response.headers.set('type', loginRes.type);

    return response;
  } catch {
    // only happens, if jwtString exists and is not valid. Hence ...
    return NextResponse.json({ message: 'Corrupt Access Token' }, { status: 401 });
  }
}
