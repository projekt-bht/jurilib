import type { Employee } from '~/generated/prisma/client';
import { EmployeeCreateInput } from '~/generated/prisma/models';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET, PATCH, DELETE } = await import('@/app/api/employee/[employeeID]/route');

// !!!! Viele Tests können aktuell nicht durchgeführt werden, da es keine Account-Erstellung für Employees gibt !!!!

describe('Employee Endpoint /employee/[employeeID] testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/employee/[employeeID]`;
  let cEmployee: Employee;

  // Currently, there is no Account creation functionality for Employees

  //   test('POST Employee', async () => {
  //     const account: AccountCreateInput = {
  //       email: 'peter' + Math.random() + '@mail.de',
  //       password: '123456',
  //       role: 'USER',
  //     };

  //     const createdAccount = await createAccount(account);

  //     const user: EmployeeCreateInput = {
  //       name: 'peter',
  //       account: {
  //         connect: { id: createdAccount.id },
  //       },
  //     };

  //     const createdEmployee = await createEmployee(user, createdAccount.id!);
  //     cEmployee = createdEmployee;
  //     expect(createdAccount.id).toBe(createdEmployee.accountId);
  //   });

  //   test('GET Employee', async () => {
  //     const req = new NextRequest(baseUrl);
  //     const res = await GET(req, { params: Promise.resolve({ employeeID: cEmployee.id }) });
  //     const json = await res.json();
  //     expect(json.length).not.toBe(0);
  //     expect(res.status).toBe(200);
  //   });

  test('GET non-existing Employee', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ employeeID: 'non-existing-id' }) });
    expect(res.status).toBe(404);
  });

  //   test('PATCH Employee name', async () => {
  //     const getReq = new NextRequest(baseUrl);
  //     const getRes = await GET(getReq, { params: Promise.resolve({ employeeID: cEmployee.id }) });
  //     const getJSON = await getRes.json();

  //     expect(getJSON.length).not.toBe(0);
  //     expect(getRes.status).toBe(200);

  //     const employee: EmployeeCreateInput = {
  //       id: cEmployee.id,
  //       name: 'updatedPeter',
  //       account: {
  //         connect: { id: cEmployee.accountId },
  //       },
  //     };

  //     const patchReq = new NextRequest(baseUrl, {
  //       headers: { 'content-type': 'application/json' },
  //       method: 'PATCH',
  //       body: JSON.stringify(employee),
  //     });

  //     const res = await PATCH(patchReq, {
  //       params: Promise.resolve({ employeeID: cEmployee.id }),
  //     });

  //     const updated = await prisma.employee.findFirst({
  //       where: { name: employee.name },
  //     });

  //     expect(updated?.name).toBe('updatedPeter');
  //     expect(res.status).toBe(200);
  //   });

  //   test('PATCH User with invalid data', async () => {
  //     const data = {};
  //     const patchReq = new NextRequest(baseUrl, {
  //       headers: { 'content-type': 'application/json' },
  //       method: 'PATCH',
  //       body: JSON.stringify(data),
  //     });

  //     const res = await PATCH(patchReq, {
  //       params: Promise.resolve({ employeeID: cEmployee.id }),
  //     });
  //     expect(res.status).toBe(400);
  //   });

  //   test('DELETE Employee', async () => {
  //     const getReq = new NextRequest(baseUrl);
  //     const res = await DELETE(getReq, { params: Promise.resolve({ employeeID: cEmployee.id }) });
  //     expect(res.status).toBe(200);
  //   });

  test('DELETE non-existing Employee', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ employeeID: 'non-existing-id' }),
    });
    expect(res.status).toBe(400);
  });
});
