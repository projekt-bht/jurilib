import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { handleError, validateHeader } from '@/app/api/helper';
import { TokenType } from '~/generated/prisma/enums';

import { sendPasswordResetEmail, sendRegistrationCodeEmail } from '../../email/service';

const resendCodeSchema = z.strictObject({
  email: z.email(),
  type: z.enum(TokenType),
});

// TODO: Rate Limiting
export async function POST(req: NextRequest) {
  try {
    validateHeader(req.headers);

    const body = resendCodeSchema.parse(await req.json());
    if (body.type === TokenType.EMAIL_VERIFICATION) {
      await sendRegistrationCodeEmail(body.email);
    } else {
      await sendPasswordResetEmail(body.email);
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    return handleError(error, 'Failed to resend code');
  }
}
