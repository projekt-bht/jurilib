import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Prisma } from '~/generated/prisma/browser';
import type { User } from '~/generated/prisma/client';

export const readUser = async (userID: string): Promise<User> => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: userID },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateUser = async (user: User, userID: string): Promise<User> => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userID } });
    if (!existingUser) {
      throw new Error('User not found for update');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        ...user,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error('Database update failed' + (error as Error).message);
  }
};

/**
 * Delete a user from the database by accountID within a transaction
 * This function is always called through the account endpoint when an account is deleted.
 */
export const deleteUserTx = async (
  accountID: string,
  tx: Prisma.TransactionClient
): Promise<void> => {
  try {
    // validate accountID
    if (!accountID) throw new ValidationError('invalidInput', 'accountID', accountID);
    // find user by accountID
    const user = await tx.user.findUnique({ where: { accountId: accountID } });
    if (!user) throw new ValidationError('notFound', 'user', accountID);
    // delete user
    await tx.user.delete({ where: { id: user.id } });
  } catch (error) {
    throw new Error('Internal Server Error while deleting user: ' + (error as Error).message);
  }
};
