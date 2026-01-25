import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { TokenType } from '~/generated/prisma/enums';

import { validateHeader } from '../../helper';
import { verifyCode } from './service';

const codeVerificationSchema = z.strictObject({
  accountId: z.string().min(1),
  type: z.enum(TokenType),
  code: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    validateHeader(req.headers);

    const body = codeVerificationSchema.parse(await req.json());

    await verifyCode(body.accountId, body.type, body.code);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
