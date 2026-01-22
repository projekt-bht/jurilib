import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { TokenType } from '~/generated/prisma/enums';

import { sendPasswordResetEmail, sendRegistrationCodeEmail } from '../../email/service';
import { validateHeader } from '../../helper';

const resendCodeSchema = z.strictObject({
  email: z.email(),
  type: z.enum(TokenType),
});

export async function POST(req: NextRequest) {
  try {
    validateHeader(req.headers);

    const body = resendCodeSchema.parse(await req.json());
    if (body.type === 'EMAIL_VERIFICATION') {
      await sendRegistrationCodeEmail(body.email);
    } else {
      await sendPasswordResetEmail(body.email);
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
