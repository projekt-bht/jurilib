import prisma from '@/lib/db';
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

export const deleteUser = async (userID: string): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: userID } });
  } catch (error) {
    throw new Error('Internal Server Error: ' + (error as Error).message);
  }
};
