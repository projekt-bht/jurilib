import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import type { Account } from '~/generated/prisma/client';
import { ValidationError } from '@/error/validationErrors';

export const readAccount = async (accountID: string): Promise<Account> => {
  try {
    const account: Account | null = await prisma.account.findUnique({
      where: { id: accountID },
    });
    if (!account) {
      throw new ValidationError('notFound', 'accounts', accountID);
    }
    return account;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateAccount = async (account: Account, accountId: string): Promise<Account> => {
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

    return updatedAccount;
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
