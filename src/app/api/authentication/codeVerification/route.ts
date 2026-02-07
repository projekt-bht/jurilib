import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { handleError, validateHeader } from '@/app/api/helper';
import { TokenType } from '~/generated/prisma/enums';

import { verifyCode } from './service';

const codeVerificationSchema = z.strictObject({
  email: z.email(),
  type: z.enum(TokenType),
  code: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    validateHeader(req.headers);

    const body = codeVerificationSchema.parse(await req.json());

    const verify = await verifyCode(body.email, body.type, body.code);
    if (verify) {
      return new Response(null, { status: 200 });
    }
    throw new Error('Code Verification failed');
  } catch (error) {
    return handleError(error, 'Code verification failed');
  }
}
