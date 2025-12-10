import { jest } from '@jest/globals';

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { GET } = await import('@/app/api/employee/route');

describe('Globale Employee Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/employee`;

  // Currently, there is no Account creation functionality for Employees

  //   test('POST Employee', async () => {
  //     const account: AccountCreateInput = {
  //       email: 'peter' + Math.random() + '@mail.de',
  //       password: '123456',
  //       role: 'EMPLOYEE',
  //     };

  //     const createdAccount = await createAccount(account);

  //     const employee: EmployeeCreateInput = {
  //       name: 'peter',
  //       account: {
  //         connect: { id: createdAccount.id },
  //       },
  //     };

  //     const createdEmployee = await createEmployee(employee, createdAccount.id!);
  //     expect(createdAccount.id).toBe(createdEmployee.accountId);
  //   });

  test('GET all Employees in DB', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
