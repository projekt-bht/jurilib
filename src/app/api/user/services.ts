import prisma from '@/lib/db';
import type { User } from '~/generated/prisma/client';
import type { UserCreateInput } from '~/generated/prisma/models';

export const createUser = async (user: UserCreateInput, accountID: string): Promise<User> => {
  try {
    if (!user || !accountID) throw new Error('Cannot Create user because of missing Data');

    const createdUser = await prisma.user.create({
      data: {
        ...user,
        account: {
          connect: { id: accountID },
        },
      },
    });

    return createdUser;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

export const readUsers = async (): Promise<User[]> => {
  try {
    const users: User[] = await prisma.user.findMany();
    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
