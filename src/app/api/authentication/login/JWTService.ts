import bcrypt from 'bcryptjs';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { LoginResource } from '@/services/Resources';
import type { Account } from '~/generated/prisma/client';

// Create a new Account
export const login = async (
  email: string,
  password: string
): Promise<{ id: string; role: 'USER' | 'EMPLOYEE' } | false> => {
  try {
    const account: Account | null = await prisma.account.findUnique({
      where: { email: email },
    });

    if (!account) {
      return false;
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) return false;

    const accountRes = {
      id: account.id,
      role: account.role,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
};

export async function verifyPasswordAndCreateJWT(
  email: string,
  password: string
): Promise<string | undefined> {
  const isLoggedIn = await login(email, password);

  if (!isLoggedIn) {
    return undefined;
  }

  const secret = process.env.JWT_SECRET;
  const ttl = process.env.JWT_TTL;

  if (!secret || !ttl) throw new Error('secret or ttl env variable not set');

  const payload: JwtPayload = {
    sub: isLoggedIn.id,
    role: isLoggedIn.role,
  };

  const jwtString = jwt.sign(payload, secret, {
    expiresIn: parseInt(ttl),
    algorithm: 'HS256',
  });

  return jwtString;
}

export function verifyJWT(jwtString: string | undefined): LoginResource {
  if (!jwtString) throw new jwt.JsonWebTokenError('ungueltiger token');

  const secret = process.env.JWT_SECRET;
  const ttl = process.env.JWT_TTL;
  if (!secret || !ttl) throw new Error('secret or ttl env variable not set');

  const payload = jwt.verify(jwtString, secret) as JwtPayload;

  const sub = payload.sub;
  const role = payload.role;
  const exp = payload.exp;

  const ressource: LoginResource = {
    id: sub!,
    role: role,
    exp: exp!,
  };
  return ressource;
}
