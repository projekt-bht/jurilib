import bcrypt from 'bcryptjs';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { User } from '~/generated/prisma/client';
import { UserCreateInput } from '~/generated/prisma/models';

export const createUser = async (input: UserCreateInput): Promise<User> => {
  const { name, email, password } = input;

  if (!name || !email || !password) {
    throw new ValidationError('invalidInput', 'requiredFields', undefined, 400);
  }

  if (password.length < 8) {
    throw new ValidationError('invalidInput', 'password', undefined, 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new ValidationError('duplicate', 'email', email, 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      type: 'USER',
    },
  });
};
