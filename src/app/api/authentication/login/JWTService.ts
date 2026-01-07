import bcrypt from 'bcryptjs';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import prisma from '@/lib/db';
import type { LoginResource } from '@/services/Resources';
import type { AccountType } from '~/generated/prisma/enums';

// Create a new Account
export const login = async (
  email: string,
  password: string
): Promise<{ id: string; userId?: string; employeeId?: string; type: AccountType } | false> => {
  try {
    /**  Include -> check if the account has a reference to the created User or Employee
         We need this information on the frontend to fetch User/Employee info
         ofc, we could just send the accountId and then check if a User exists in that context, but thats kinda cursed
         Also, this logic makes more sense because we are only validating a login if an account includes a User or Employee
    */
    const account = await prisma.account.findUnique({
      where: { email: email },
      include: { user: true, employee: true },
    });

    if (!account) {
      return false;
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) return false;

    const accountRes = {
      id: account.id,
      userId: account.user?.id,
      employeeId: account.employee?.id,
      type: account.type,
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
    accountId: isLoggedIn.id,
    userId: isLoggedIn.userId,
    employeeId: isLoggedIn.employeeId,
    type: isLoggedIn.type,
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

  const accountId = payload.accountId;
  const userId = payload.userId;
  const employeeId = payload.employeeId;
  const type = payload.type;
  const exp = payload.exp;

  const ressource: LoginResource = {
    id: accountId,
    userId: userId,
    employeeId: employeeId,
    type: type,
    exp: exp!,
  };
  return ressource;
}
