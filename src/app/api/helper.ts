import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Validate the 'content-type' of the request header is 'application/json'
 */
export const headerSchema = z.object({
  'content-type': z.string().refine((val) => val.includes('application/json'), {
    message: 'Invalid content type, must be application/json',
  }),
});

export function handleValidationError(error: z.ZodError) {
  return NextResponse.json({ message: 'Validation error', errors: error }, { status: 400 });
}
