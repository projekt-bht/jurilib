import { jest } from '@jest/globals';

import type { Employee } from '~/generated/prisma/client';
import { EmployeeCreateInput, OrganizationCreateInput } from '~/generated/prisma/models';
import { createOrganization } from '../../organization/services';

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  vectorizeExpertiseArea: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { POST: orgPOST } = await import('@/app/api/organization/route');
const { GET, PATCH } = await import('@/app/api/employee/[employeeID]/route');
const { DELETE } = await import('@/app/api/account/[accountID]/route');
const { POST } = await import('@/app/api/authentication/register/route');

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
    const createdOrga = await resOrga.json();
    console.log('TEST - Created Organization response message:', createdOrga.message);
    expect(resOrga.status).toBe(201);

    // Create both account and employee through registration route
    const registerInput = {
      email: 'EMPLOYEE_TEST_' + Math.random() + '@mail.de',
      password: '123456',
      role: 'EMPLOYEE',
      name: 'Peter Mustermann',
      organizationId: createdOrga.id,
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
    console.log('TEST EMPLOYEE - Created Employee:', createdEmployee);
    console.log('TEST EMPLOYEE - Created Employee response message:', createdEmployee.message);
    cEmployee = createdEmployee;
    expect(createdEmployee.name).toBe(registerInput.name);

    const createdAccount = await prisma.account.findUnique({
      where: { email: registerInput.email },
    });
    expect(createdAccount).not.toBeNull();
    expect(createdAccount?.id).toBe(createdEmployee.accountId);
    expect(createdAccount?.email).toBe(registerInput.email);
  });

  test('GET Employee', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ employeeID: cEmployee.id }) });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('GET non-existing Employee', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ employeeID: 'non-existing-id' }) });
    expect(res.status).toBe(404);
  });

  test('PATCH Employee name', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ employeeID: cEmployee.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const employee = {
      id: cEmployee.id,
      name: 'updatedPeter',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(employee),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });

    const updated = await prisma.employee.findFirst({
      where: { name: employee.name },
    });

    expect(updated?.name).toBe('updatedPeter');
    expect(res.status).toBe(200);
  });

  test('PATCH User with invalid data', async () => {
    const data = {};
    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });
    expect(res.status).toBe(400);
  });

  test('DELETE Employee through account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: cEmployee.accountId }),
    });
    expect(res.status).toBe(200);
    const deleted = await prisma.employee.findUnique({ where: { id: cEmployee.id } });
    expect(deleted).toBeNull();
  });

  test('DELETE non-existing Employee', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: 'non-existing-id' }),
    });
    expect(res.status).toBe(404);
  });
});
