import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Prisma, User } from '~/generated/prisma/client';
import type { UserUncheckedCreateInput } from '~/generated/prisma/models';

// Create a new user within a transaction
export const createUserTx = async (
  user: UserUncheckedCreateInput,
  tx: Prisma.TransactionClient
): Promise<User> => {
  // console.log('Test 9: programm läuft noch');
  // console.log('User data:', user);
  try {
    if (!user) throw new ValidationError('invalidInput', 'user', user);
    if (!user.accountId) throw new ValidationError('invalidInput', 'account', user.accountId);

    // console.log('Test 10: programm läuft noch');

    // TODO: Add more validations as needed and add phone and address as optional fields
    const createdUser = await tx.user.create({
      data: {
        name: user.name,
        phone: user.phone,
        address: user.address,
        account: {
          connect: { id: user.accountId },
        },
      },
    });

    // console.log('Test 11: programm läuft noch');
    // console.log('Created user:', createdUser);

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
