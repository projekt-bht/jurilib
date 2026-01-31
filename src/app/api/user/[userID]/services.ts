import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Prisma } from '~/generated/prisma/browser';
import type { User } from '~/generated/prisma/client';
import type { UserUpdateInput } from '~/generated/prisma/models';

export const readUser = async (userID: string): Promise<User> => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: userID },
    });
    if (!user) {
      throw new ValidationError('notFound', 'user', userID, 404);
    }
    return user;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateUser = async (user: UserUpdateInput, userID: string): Promise<User> => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userID } });
    if (!existingUser) {
      throw new ValidationError('notFound', 'user', userID, 404);
    }

    if (Object.keys(user).length === 0) {
      throw new ValidationError('invalidInput', 'user', user);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        ...user,
      },
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database update failed' + (error as Error).message);
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
    if (!user) throw new ValidationError('notFound', 'user', accountID, 404);
    // delete user
    await tx.user.delete({ where: { id: user.id } });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Internal Server Error while deleting user: ' + (error as Error).message);
  }
};
