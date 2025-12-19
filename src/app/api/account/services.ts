import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account, Prisma } from '~/generated/prisma/client';
import type { AccountCreateInput } from '~/generated/prisma/models';

// Create a new Account within a transaction
export const createAccountTx = async (
  account: AccountCreateInput,
  tx: Prisma.TransactionClient
): Promise<AccountResource> => {
  // console.log('Test 4: programm läuft noch');
  // console.log('Account data:', account);
  try {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    // console.log('Test 5: programm läuft noch');
    // console.log('Hashed password:', hashedPassword);

    const createdAccount = await tx.account.create({
      data: {
        email: account.email,
        password: hashedPassword,
        role: account.role,
      },
    });

    // console.log('Test 6: programm läuft noch');
    // console.log('Created account:', createdAccount);

    const accountRes = {
      id: createdAccount.id,
      email: createdAccount.email,
      role: createdAccount.role,
    };

    // console.log('Test 7: programm läuft noch');
    // console.log('Account resource to return:', accountRes);

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
