import { jest } from '@jest/globals';

import type { AccountCreateInput, UserCreateInput } from '~/generated/prisma/models';

import { createAccount } from '../account/services';
import { createUser, readUsers } from './services';

describe('User testen', () => {
  test('POST User', async () => {
    const account: AccountCreateInput = {
      email: 'peter' + Math.random() + '@mail.de',
      password: '123456',
      role: 'USER',
    };

    const createdAccount = await createAccount(account);

    const user: UserCreateInput = {
      name: 'peter',
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
