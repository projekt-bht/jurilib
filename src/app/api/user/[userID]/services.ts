import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { User } from '~/generated/prisma/client';
import type { UserUpdateInput } from '~/generated/prisma/models';

export const readUser = async (userID: string): Promise<User> => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: userID },
    });
    if (!user) {
      throw new ValidationError('notFound', 'user', userID);
    }
    return user;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};

export const updateUser = async (user: UserUpdateInput, userID: string): Promise<User> => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userID } });
    if (!existingUser) {
      throw new ValidationError('notFound', 'user', userID);
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
    throw new Error('Database update failed' + (error as Error).message);
  }
};

export const deleteUser = async (userID: string): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: userID } });
  } catch (error) {
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
