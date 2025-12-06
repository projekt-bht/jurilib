import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import type { Account } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Create a new Account
export const createAccount = async (account: AccountCreateInput): Promise<Account> => {
  try {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const createdAccount = await prisma.account.create({
      data: { ...account, password: hashedPassword },
    });

    return createdAccount;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

// Read all Accounts
export const readAccounts = async (): Promise<Account[]> => {
  try {
    const accounts: Account[] = await prisma.account.findMany();
    if (!accounts) {
      throw new Error('Accounts not found');
    }
    return accounts;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
