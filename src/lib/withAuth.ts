/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { verifyJWT } from '@/app/api/authentication/login/JWTService';
import { unauthorized } from '@/app/api/helper';
import type { EmployeeLoginResource, LoginResource, UserLoginResource } from '@/services/Resources';

type UserHandler = (
  req: NextRequest,
  ctx: any,
  account: UserLoginResource
) => Promise<NextResponse>;

type EmployeeHandler = (
  req: NextRequest,
  ctx: any,
  account: EmployeeLoginResource
) => Promise<NextResponse>;

export function withUserAuth(handler: UserHandler) {
  return async (req: NextRequest, ctx: any) => {
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      return unauthorized();
    }

    try {
      const loginResource: LoginResource = verifyJWT(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { employeeId, ...userResource } = loginResource;
      // Ensure userId is not undefined for UserLoginResource
      if (userResource.userId) {
        return handler(req, ctx, userResource as UserLoginResource);
      } else {
        return unauthorized();
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  };
}

export function withEmployeeAuth(handler: EmployeeHandler) {
  return async (req: NextRequest, ctx: any) => {
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      return unauthorized();
    }

    try {
      const loginResource: LoginResource = verifyJWT(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...employeeResource } = loginResource;
      // Ensure userId is not undefined for UserLoginResource
      if (employeeResource.employeeId) {
        return handler(req, ctx, employeeResource as EmployeeLoginResource);
      } else {
        return unauthorized();
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  };
}
