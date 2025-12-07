import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account } from '~/generated/prisma/client';

export const readAccount = async (accountID: string): Promise<AccountResource> => {
  try {
    const account: Account | null = await prisma.account.findUnique({
      where: { id: accountID },
    });
    if (!account) {
      throw new ValidationError('notFound', 'accounts', accountID);
    }

    const accountRes = {
      id: account.id,
      email: account.email,
      role: account.role,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateAccount = async (
  account: Account,
  accountId: string
): Promise<AccountResource> => {
  try {
    const existingAccount = await prisma.account.findUnique({ where: { id: accountId } });
    if (!existingAccount) {
      throw new ValidationError('notFound', 'accounts', accountId);
    }

    if (account.password) account.password = await bcrypt.hash(account.password, 10);

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        ...account,
      },
    });

    const accountRes = {
      id: updatedAccount.id,
      email: updatedAccount.email,
      role: updatedAccount.role,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database update failed' + (error as Error).message);
  }
};

export const deleteAccount = async (accountID: string): Promise<void> => {
  try {
    await prisma.account.delete({ where: { id: accountID } });
  } catch (error) {
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
