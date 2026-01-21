import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from './authentication/login/JWTService';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * Validate the 'content-type' of the request header is 'application/json'
 */
const headerSchema = z.object({
  'content-type': z.string().includes('application/json', {
    message: 'Invalid content type, must be application/json',
  }),
});

/**
 * Validate request headers, specifically the content-type
 */
export function validateHeader(headers: Headers): void {
  const contentType = headers.get('content-type');
  headerSchema.parse({ 'content-type': contentType ?? '' });
}

export function handleValidationError(error: z.ZodError) {
  console.error('Validation error:', error);
  return NextResponse.json({ message: 'Validation error', errors: error }, { status: 400 });
}

// global handler, so context could be anything --> enforce any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withUserAuth(handler: Handler): Handler {
  return async (req, context) => {
    const token = req.cookies.get('access_token')?.value;
    try {
      const loginResource = verifyJWT(token);
      if (!loginResource.userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Merge userId and params into context for downstream usage
      const extendedContext = {
        ...context,
        userId: loginResource.userId,
        params: context?.params,
      };
      return handler(req, extendedContext);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return NextResponse.json(
          { message: 'Something went wrong: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  };
}
export function withEmployeeAuth(handler: Handler): Handler {
  return async (req, context) => {
    const token = req.cookies.get('access_token')?.value;
    try {
      const loginResource = verifyJWT(token);
      if (!loginResource.employeeId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Merge employeeId and params into context for downstream usage
      const extendedContext = {
        ...context,
        employeeId: loginResource.employeeId,
        params: context?.params,
      };
      return handler(req, extendedContext);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return NextResponse.json(
          { message: 'Something went wrong: ' + (error as Error).message },
          { status: 400 }
        );
      }
    }
  };
}
