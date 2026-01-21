import { JsonWebTokenError } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyJWT } from './authentication/login/JWTService';

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

export function unauthorized(): never {
  throw NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
