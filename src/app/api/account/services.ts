import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Create a new Account
export const createAccount = async (account: AccountCreateInput): Promise<AccountResource> => {
  try {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const createdAccount = await prisma.account.create({
      data: { ...account, password: hashedPassword },
    });

    const accountRes = {
      id: createdAccount.id,
      email: createdAccount.email,
      role: createdAccount.role,
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
      throw new ValidationError('notFound', 'accounts', accounts);
    }

    const accRes = accounts.map((account) => ({
      id: account.id,
      email: account.email,
      role: account.role,
    }));

    return accRes;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
