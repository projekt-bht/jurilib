import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account, Prisma } from '~/generated/prisma/client';
import { AccountUpdateSchema } from './route';
import { AccountUpdateInput } from '~/generated/prisma/models';

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
      type: account.type,
      isVerified: account.isVerified,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

/**
 * Update an existing account in the database by accountID
 * Only mail and password can be updated.
 * Role and id are immutable, since they are used to connect
 * the account to other entities.
 */
export const updateAccount = async (
  account: AccountUpdateSchema,
  accountId: string
): Promise<AccountResource> => {
  try {
    const existingAccount = await prisma.account.findUnique({ where: { id: accountId } });
    if (!existingAccount) {
      throw new ValidationError('notFound', 'accounts', accountId);
    }

    if (account.password) account.password = await bcrypt.hash(account.password, 10);
    // has to be checked this way, "account.isVerified ?? existingAccount.isVerified" would
    // not when changing isVerified to false
    if (!account.hasOwnProperty('isVerified')) account.isVerified = existingAccount.isVerified;

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        email: account.email ?? existingAccount.email,
        password: account.password ?? existingAccount.password,
        isVerified: account.isVerified,
      },
    });

    const accountRes = {
      id: updatedAccount.id,
      email: updatedAccount.email,
      type: updatedAccount.type,
      isVerified: updatedAccount.isVerified,
    };

    return accountRes;
  } catch (error) {
    throw new Error('Database update failed' + (error as Error).message);
  }
};

export const deleteAccountTx = async (
  accountID: string,
  tx: Prisma.TransactionClient
): Promise<void> => {
  try {
    // validate accountID
    if (!accountID) throw new ValidationError('invalidInput', 'accountID', accountID);
    // delete account
    await tx.account.delete({ where: { id: accountID } });
  } catch (error) {
    throw new Error('Internal Server Error while deleting account: ' + (error as Error).message);
  }
};
