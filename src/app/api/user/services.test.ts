import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';
import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

import { createAccount } from '../account/services';
import { createUser, readUsers } from './services';

describe('User testen', () => {
  test('POST User', async () => {
    const account: AccountCreateInput = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '123456',
      type: AccountType.USER,
    };

    const createdAccount = await createAccount(account);

    const user: UserCreateInput = {
      firstname: 'peter',
      lastname: 'pan',
      birthdate: new Date('1990-01-01'),
      gender: Gender.Mann,
      pronoun: Pronoun.HE_HIM,
      phone: '0123456789',

      country: 'Germany',
      city: 'Berlin',
      zipCode: '12345',
      street: 'Musterstraße',
      houseNumber: '1A',
      account: {
        connect: { id: createdAccount.id },
      },
    };

    const createdUser = await createUser(user, createdAccount.id!);
    expect(createdAccount.id).toBe(createdUser.accountId);
  });

  test('GET Users', async () => {
    const users = await readUsers();
    expect(users.length).not.toBe(0);
  });
});
