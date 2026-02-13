import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Prisma, User } from '~/generated/prisma/client';
import type { UserUncheckedCreateInput } from '~/generated/prisma/models';

// Create a new user within a transaction
export const createUserTx = async (
  user: UserUncheckedCreateInput,
  tx: Prisma.TransactionClient
): Promise<User> => {
  try {
    if (!user) throw new ValidationError('invalidInput', 'user', user);
    if (!user.accountId) throw new ValidationError('invalidInput', 'account', user.accountId);

    // TODO: Add more validations as needed and add phone and address as optional fields
    const createdUser = await tx.user.create({
      data: {
        title: user.title,
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        genderText: user.genderText,
        pronoun: user.pronoun,
        pronounText: user.pronounText,
        birthdate: user.birthdate,
        placeOfBirth: user.placeOfBirth,
        phone: user.phone,
        imageUrl: user.imageUrl,
        country: user.country,
        city: user.city,
        street: user.street,
        zipCode: user.zipCode,
        account: {
          connect: { id: user.accountId },
        },
      },
    });

    return createdUser;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database insert failed: ' + (error as Error).message);
  }
};

export const readUsers = async (): Promise<User[]> => {
  try {
    const users: User[] = await prisma.user.findMany();
    if (!users) {
      throw new ValidationError('notFound', 'users', users, 404);
    }

    return users;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    else throw new Error('Database query failed: ' + (error as Error).message);
  }
};
