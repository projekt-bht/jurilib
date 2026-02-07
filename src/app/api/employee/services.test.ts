// Prepare mocking for sending emails and vectorizing - must be defined before importing the route handlers
import { jest } from '@jest/globals';

jest.unstable_mockModule('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  createEmbedding: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Non-mock related implementation:

import { readAllEmployees } from './services';

describe('Globale Employee Services testen', () => {
  // Currently, there is no Account creation functionality for Employees

  //   test('POST User', async () => {
  //     const account: AccountCreateInput = {
  //       email: 'peter' + Math.random() + '@mail.de',
  //       password: '123456',
  //       role: 'USER',
  //     };

  //     const createdAccount = await createAccount(account);

  //     const user: UserCreateInput = {
  //       name: 'peter',
  //       account: {
  //         connect: { id: createdAccount.id },
  //       },
  //     };

  //     const createdUser = await createUser(user, createdAccount.id);
  //     expect(createdAccount.id).toBe(createdUser.accountId);
  //   });

  test('GET all Employees from DB', async () => {
    const employees = await readAllEmployees();
    expect(employees.length).not.toBe(0);
  });
});
