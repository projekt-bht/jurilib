import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';
import { User } from '~/generated/prisma/client';
import { UserCreateInput } from '~/generated/prisma/models';
//schau bei Hannes ob er organizationCreateInput nutzt wenn nicht korregiere
// Nutze hier den ValidationError aus app/errors/ der mit dem Merge kommt
// Wurde von Lian erstellt, also bei Fragen an sie wenden
export class UserServiceError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const createUser = async (input: UserCreateInput): Promise<User> => {
  const { name, email, password } = input;

  if (!name || !email || !password) {
    throw new UserServiceError('Alle Pflichtfelder müssen ausgefüllt werden', 400);
  }

  if (password.length < 8) {
    throw new UserServiceError('Passwort muss mindestens 8 Zeichen lang sein', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new UserServiceError('E-Mail bereits registriert', 400);
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
