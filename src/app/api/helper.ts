import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ValidationError } from '@/error/validationErrors';

// ---------- header validation ----------

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
export function validateHeader(headers: Headers) {
  try {
    const contentType = headers.get('content-type');
    headerSchema.parse({ 'content-type': contentType ?? '' });
  } catch {
    throw new ValidationError(
      'invalidContentType',
      'content-type',
      headers.get('content-type'),
      415
    );
  }
}

// ---------- param id validation ----------
/**
 * Validate that given params contain valid UUIDs
 * @param params id is the value to validate, identifier is a descriptive name for error messages
 */
export function validateIds(params: { id: string; identifier: string }[]): void {
  for (const param of params) {
    const idSchema = z.strictObject({
      id: z.uuid({ message: 'Invalid UUID format for ' + param.identifier }),
    });
    idSchema.parse({ id: param.id });
  }
}

// ---------- error handling ----------

export function handleValidationError(error: z.ZodError) {
  let errorStack = {};
  for (const issue of error.issues) {
    const message = issue.message;
    errorStack = { ...errorStack, message };
  }
  return NextResponse.json({ message: 'Validation error', errors: errorStack }, { status: 400 });
}

export function handleError(error: unknown, message: string) {
  return NextResponse.json(
    { message: `${message}:  ${(error as Error).message}` },
    { status: (error as ValidationError).statusCode ?? 400 }
  );
}

export function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
