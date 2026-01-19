// TODO: check ZOD validation

import { NextResponse } from 'next/server';
import { z } from 'zod';

// ---------- header validation ----------

// Validate the 'content-type' of the request header is 'application/json'
const headerSchema = z.object({
  'content-type': z.string().includes('application/json', {
    message: 'Invalid content type, must be application/json',
  }),
});

// Validate request headers, specifically the content-type
export function validateHeader(headers: Headers): void {
  const contentType = headers.get('content-type');
  headerSchema.parse({ 'content-type': contentType ?? '' });
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
  console.error('Validation error:', error);
  let errorStack = {};
  for (const issue of error.issues) {
    const message = issue.message;
    errorStack = { ...errorStack, message };
  }
  return NextResponse.json({ message: 'Validation error', errors: errorStack }, { status: 400 });
}
