import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from './app/api/authentication/login/JWTService';
/**
 *
 * If a route contains a slug route, e.g. /api/appointment/[appointmentID], the route will still be resolved/interpreted
 *
 * @param definedRoutes contains all predefined/possible Routes.
 * @param routeToBeChecked given route from nextURl.pathname
 * @returns the `routeToBeChecked` if it does not contain a UUID **OR** returns the `routeToBeChecked`
 */
function resolveSlugRoutes(definedRoutes: string[], routeToBeChecked: string): string {
  // using Zod to check, if the route uses a REAL uuid
  const zodSchema = z.strictObject({ uuid: z.uuid() });

  // split route into seperate parts, so each can be checked, if it has a uuid
  const routeParts = routeToBeChecked.split('/');
  let containsUUID = false;
  for (const routePart of routeParts) {
    try {
      // if a uuid exists in the route, switch containsUUID to true
      zodSchema.parse({ uuid: routePart });
      containsUUID = true;
    } catch {
      // continue the loop if zod throws an error -> no uuid found
      continue;
    }
  }
  // return some route from the definedRoutes array, if routeToBeChecked matches with a defined route
  if (containsUUID) {
    // UUID pattern for matching
    // matches RFC 4122, just like z.uuid()
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

    // Find matching route pattern in definedRoutes
    for (const definedRoute of definedRoutes) {
      // Replace [paramName] placeholders with UUID regex pattern
      const routePattern = definedRoute.replace(/\[\w+\]/g, uuidPattern.source);
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(routeToBeChecked)) {
        return definedRoute;
      }
    }

    // No match found, return the original route
    return routeToBeChecked;
  } else {
    return routeToBeChecked;
  }
}

const requiresAuthRoutes = [
  '/api/dashboard',
  '/api/user/',
  '/api/appointment/[appointmentID]/request',
  '/api/appointment/[appointmentID]/cancel',
  '/api/case/user/[userID]',
  '/api/case/employee/[employeeID]',
];

export function proxy(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;
  const requiredRoute = resolveSlugRoutes(requiresAuthRoutes, pathname);

  if (requiresAuthRoutes.some((route) => requiredRoute.startsWith(route))) {
    return requiresAuthentication(request, response);
  } else {
    return optionalAuthentication(request, response);
  }
}

/**
 * https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d
 * Configure the scope of the middleware (example: everything expect -> _next/Static, _next/image etc.)
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function requiresAuthentication(req: NextRequest, _res: NextResponse) {
  try {
    const loginRes = verifyJWT(req.cookies.get('access_token')?.value);
    const response = NextResponse.next();

    // check if userId or employeeId exists
    if (loginRes.userId) response.headers.set('userID', loginRes.userId);
    if (loginRes.employeeId) response.headers.set('employeeId', loginRes.employeeId);
    // set accountID and account type anyways
    response.headers.set('ID', loginRes.id);
    response.headers.set('type', loginRes.type);

    return response;
  } catch {
    //No need to send detailed Error Message for security reasons, "Not Authorized" is enough.
    return NextResponse.json({ message: 'Not Authorized' }, { status: 401 });
  }
}

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
