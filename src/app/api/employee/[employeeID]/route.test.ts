import type { Employee } from '~/generated/prisma/client';
import { EmployeeCreateInput, OrganizationCreateInput } from '~/generated/prisma/models';
import { createOrganization } from '../../organization/services';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { POST: orgPOST } = await import('@/app/api/organization/route');
const { GET, PATCH, DELETE } = await import('@/app/api/employee/[employeeID]/route');

// !!!! Viele Tests können aktuell nicht durchgeführt werden, da es keine Account-Erstellung für Employees gibt !!!!

describe('Employee Endpoint /employee/[employeeID] testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/employee/[employeeID]`;
  let cEmployee: Employee;

  test('Create Account and Employee', async () => {
    // Create Organization first
    const organization: OrganizationCreateInput = {
      name: 'Test Org for Employee',
      description: 'Org Description',
      shortDescription: 'Org Short Desc',
      email: 'orgemail_test' + Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      priceCategory: 'MEDIUM',
      expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
    };

    const reqOrga = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organization),
    });

    const resOrga = await orgPOST(reqOrga);
    console.log('TEST - Created Organization Response Status:', resOrga.status);
    const orgaJsonResponse = await resOrga.json();
    console.log('TEST - Created Organization response message:', orgaJsonResponse.message);
    expect(resOrga.status).toBe(201);

    const createdOrg = await resOrga.json();

    // Create both account and employee through registration route
    const registerInput = {
      email: 'EMPLOYEE_TEST_' + Math.random() + '@mail.de',
      password: '123456',
      role: 'EMPLOYEE',
      name: 'Peter Mustermann',
      organizationId: createdOrg.id,
      expertiseArea: ['Arbeitsrecht', 'Familienrecht'],
    };

    const reqRegister = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const resRegister = await POST(reqRegister);
    expect(resRegister.status).toBe(201);

    const createdEmployee = await resRegister.json();
    cEmployee = createdEmployee;
    expect(createdEmployee.email).toBe(registerInput.email);
  });

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
