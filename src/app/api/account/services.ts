import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account, Prisma } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

//Create a new Account within a transaction
export const createAccountTx = async (
  account: AccountCreateInput,
  tx: Prisma.TransactionClient
): Promise<AccountResource> => {
  try {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const createdAccount = await tx.account.create({
      data: {
        email: account.email,
        password: hashedPassword,
        type: account.type,
      },
    });

    const accountRes = {
      id: createdAccount.id,
      email: createdAccount.email,
      type: createdAccount.type,
      isVerified: createdAccount.isVerified,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

// Read all Accounts
export const readAccounts = async (): Promise<AccountResource[]> => {
  try {
    const accounts: Account[] = await prisma.account.findMany();
    if (!accounts) {
      throw new ValidationError('notFound', 'accounts', accounts, 404);
    }

    const accRes = accounts.map((account) => ({
      id: account.id,
      email: account.email,
      type: account.type,
      isVerified: account.isVerified,
    }));

    return accRes;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database query failed: ' + (error as Error).message);
  }
};

// TODO: Check if OTP is correct otherwise dont change password
export const updatePasswordWithEmail = async (email: string, password: string) => {
  try {
    const existingAccount = await prisma.account.findUnique({ where: { email: email } });
    if (!existingAccount) {
      throw new ValidationError('notFound', 'accounts', email);
    }

    if (password !== undefined) password = await bcrypt.hash(password, 10);

    await prisma.account.update({
      where: { email: email },
      data: {
        password: password,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database update failed' + (error as Error).message);
  }
};
