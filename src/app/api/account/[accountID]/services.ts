import bcrypt from 'bcryptjs';

import { validateIds } from '@/app/api/helper';
import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { AccountResource } from '@/services/Resources';
import type { Account, Prisma } from '~/generated/prisma/client';

export const readAccount = async (accountID: string): Promise<AccountResource> => {
  try {
    const account: Account | null = await prisma.account.findUnique({
      where: { id: accountID },
    });
    if (!account) {
      throw new ValidationError('notFound', 'accounts', accountID, 404);
    }

    const accountRes = {
      id: account.id,
      email: account.email,
      type: account.type,
      isVerified: account.isVerified,
    };

    return accountRes;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database query failed: ' + (error as Error).message);
  }
};

/**
 * Update an existing account in the database by accountID
 *
 * Only mail, password and isVerifiedcan be updated.
 * Type and id are immutable, since they are used to connect the account to other entities.
 *
 * @param accountId - The ID of the account to update
 * @param data - Partial account data to update (it can include email, password, isVerified)
 * @returns The updated account resource
 */
export const updateAccount = async (
  accountId: string,
  data: Partial<Account>
): Promise<AccountResource> => {
  try {
    // get account
    const existingAccount = await prisma.account.findUnique({ where: { id: accountId } });
    if (!existingAccount) {
      throw new ValidationError('notFound', 'accounts', accountId, 404);
    }

    // validate no immutable fields are being changed
    if (data.type || data.type || data.id) {
      throw new ValidationError('immutableField', 'type', data.type);
    }

    // hash password if being updated
    if (data.password !== undefined) data.password = await bcrypt.hash(data.password, 10);

    // update account
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        ...data,
      },
    });

    // return updated account
    const accountRes: AccountResource = {
      id: updatedAccount.id,
      email: updatedAccount.email,
      type: updatedAccount.type,
      isVerified: updatedAccount.isVerified,
    };

    return accountRes;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database update failed' + (error as Error).message);
  }
};

export const deleteAccountTx = async (
  accountID: string,
  tx: Prisma.TransactionClient
): Promise<void> => {
  try {
    // validate accountID
    validateIds([{ id: accountID, identifier: 'accountID' }]);

    // delete account
    await tx.account.delete({ where: { id: accountID } });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else
      throw new Error('Internal Server Error while deleting account: ' + (error as Error).message);
  }
};
