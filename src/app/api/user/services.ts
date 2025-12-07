import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { User } from '~/generated/prisma/client';
import type { UserCreateInput } from '~/generated/prisma/models';

export const createUser = async (user: UserCreateInput, accountID: string): Promise<User> => {
  try {
    if (!user) throw new ValidationError('invalidInput', 'user', user);
    if (!accountID) throw new ValidationError('invalidInput', 'account', accountID);

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
      throw new ValidationError('notFound', 'users', users);
    }

    return users;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
};
