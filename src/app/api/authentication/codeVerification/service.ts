import crypto from 'crypto';

import prisma from '@/lib/db';
import { TokenType } from '~/generated/prisma/enums';

const EXPIRY_MINUTES = 15;

/**
 * Generates a secure 6-digit code. And stores it in the database. Either creates a new
 * entry or updates an existing one.
 *
 * @returns SHA-256 hash of the generated code
 */
export async function generateCode(
  accountId: string,
  tokenType: TokenType
): Promise<{ token: string; expiryMinutes: number }> {
  const token = crypto.randomInt(100000, 999999).toString(); // 6-digit code
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  const existingToken = await prisma.accountToken.findMany({
    where: { accountId: accountId, type: tokenType },
  });

  if (existingToken && existingToken.length > 0) {
    // Overwrite existing token
    await prisma.accountToken.update({
      where: { id: existingToken[0].id },
      data: {
        token: hash,
        expiresAt: new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000), // expires in 15 minutes
        usedAt: null,
      },
    });
  } else {
    // Create new token
    await prisma.accountToken.create({
      data: {
        accountId: accountId,
        type: tokenType,
        token: hash,
        expiresAt: new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000), // expires in 15 minutes
      },
    });
  }

  return { token: token, expiryMinutes: EXPIRY_MINUTES };
}

/**
 * Verifies a given code against the stored hashed code for an account and type
 * and marks it as used and the user as verified if valid.
 *
 * @returns true
 */
export async function verifyCode(
  accountId: string,
  type: TokenType,
  inputToken: string
): Promise<boolean> {
  try {
    /**
     * findMany is used since both tokens for verification and password reset
     * can exist simultaneously for the same account.
     *
     * There should only be one token of each type per account, since existing
     * tokens are overwritten when a new token is generated.
     */
    const savedTokenHash = await prisma.accountToken.findMany({
      where: { accountId: accountId, type: type },
    });

    if (!savedTokenHash || savedTokenHash.length === 0) return false;
    if (savedTokenHash[0].expiresAt < new Date(Date.now())) return false;

    const inputTokenHash = crypto.createHash('sha256').update(inputToken).digest('hex');

    if (savedTokenHash[0].token === inputTokenHash) {
      await prisma.accountToken.update({
        where: { id: savedTokenHash[0].id },
        data: { usedAt: new Date() },
      });
      if (type === TokenType.EMAIL_VERIFICATION) {
        await prisma.account.update({
          where: { id: accountId },
          data: { isVerified: true },
        });
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('Error verifying code: ' + (error as Error).message);
  }
}
