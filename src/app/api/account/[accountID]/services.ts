import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import type { Account } from '~/generated/prisma/client';

export const readAccount = async (accountID: string): Promise<Account> => {
  try {
    const account: Account | null = await prisma.account.findUnique({
      where: { id: accountID },
    });
    if (!account) {
      throw new Error('Account not found');
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
      throw new Error('Account not found for update');
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
