// Prepare mocking for sending emails and vectorizing - must be defined before importing the route handlers
import { jest } from '@jest/globals';

jest.unstable_mockModule('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  vectorizeExpertiseArea: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Non-mock related implementation:

import {
  Accessibility,
  AccountType,
  Area,
  type Employee,
  Gender,
  Language,
  OrganizationType,
  PriceCategory,
  Pronoun,
} from '~/generated/prisma/client';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

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
      type: OrganizationType.LAW_FIRM,
      priceCategory: PriceCategory.LOW,
      expertiseAreas: [Area.Vergaberecht, Area.Arbeitsrecht],
      accessibility: [Accessibility.Aufzug_vorhanden, Accessibility.Rampe_vorhanden],
      country: 'Deutschland',
      city: 'Berlin',
      zipCode: '10115',
      street: 'Musterstraße',
      houseNumber: '1A',
      averageRating: 4.5,
      numberOfRatings: 10,
    };

    const reqOrga = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organization),
    });

    const resOrga = await orgPOST(reqOrga);
    const createdOrga = await resOrga.json();
    expect(resOrga.status).toBe(201);

    // Create both account and employee through registration route
    // TODO: Cannot use RegisterResource here because of
    // missmatching attributes. Need to refactor RegisterResource first.
    const registerInput = {
      account: {
        email: 'EMPLOYEE_TEST_' + Math.random() + '@mail.de',
        password: '1234567890',
        type: AccountType.EMPLOYEE,
      },
      entity: {
        firstname: 'Peter',
        lastname: 'Muster',
        gender: Gender.Mann,
        pronoun: Pronoun.er_ihm,
        languages: [Language.DEUTSCH, Language.ENGLISCH],
        organizationId: createdOrga.id,
        expertiseArea: [Area.Arbeitsrecht, Area.Familienrecht],
        email: 'peter.muster@mail.de',
      },
    };

    const reqRegister = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const resRegister = await POST(reqRegister);
    expect(resRegister?.status).toBe(201);

    const createdEmployee = await resRegister?.json();
    cEmployee = createdEmployee;
    expect(createdEmployee.firstname).toBe(registerInput.entity.firstname);
    expect(createdEmployee.lastname).toBe(registerInput.entity.lastname);

    const createdAccount = await prisma.account.findUnique({
      where: { email: registerInput.account.email },
    });
    expect(createdAccount).not.toBeNull();
    expect(createdAccount?.id).toBe(createdEmployee.accountId);
    expect(createdAccount?.email).toBe(registerInput.account.email);
  });

  test('GET Employee', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, { params: Promise.resolve({ employeeID: cEmployee.id }) });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  // test('GET Employee with invalid UUID', async () => {
  //   const req = new NextRequest(baseUrl);
  //   const res = await GET(req, { params: Promise.resolve({ employeeID: 'non-existing-id' }) });
  //   expect(res.status).toBe(400);
  // });

  test('GET Employee non-existing', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req, {
      params: Promise.resolve({ employeeID: '00000000-4af3-4b8c-8601-000000000000' }),
    });
    expect(res.status).toBe(404);
  });

  test('PATCH Employee name', async () => {
    const getReq = new NextRequest(baseUrl);
    const getRes = await GET(getReq, { params: Promise.resolve({ employeeID: cEmployee.id }) });
    const getJSON = await getRes.json();

    expect(getJSON.length).not.toBe(0);
    expect(getRes.status).toBe(200);

    const employee = {
      firstname: 'updatedPeter',
    };

    const patchReq = new NextRequest(baseUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(employee),
    });

    const res = await PATCH(patchReq, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });

    expect(res.status).toBe(200);

    const updated = await prisma.employee.findFirst({
      where: { id: cEmployee.id },
    });

    expect(updated?.firstname).toBe('updatedPeter');
    expect(res.status).toBe(200);
  });

  // test('PATCH User with invalid data', async () => {
  //   const data = {
  //     id: 12345,
  //   };
  //   const patchReq = new NextRequest(baseUrl, {
  //     headers: { 'content-type': 'application/json' },
  //     method: 'PATCH',
  //     body: JSON.stringify(data),
  //   });

  //   const res = await PATCH(patchReq, {
  //     params: Promise.resolve({ employeeID: cEmployee.id }),
  //   });
  //   expect(res.status).toBe(400);
  // });

  test('DELETE Employee through account', async () => {
    const getReq = new NextRequest(baseUrl);
    const res = await DELETE(getReq, {
      params: Promise.resolve({ accountID: cEmployee.accountId }),
    });
    expect(res.status).toBe(200);
    const deleted = await prisma.employee.findUnique({ where: { id: cEmployee.id } });
    expect(deleted).toBeNull();
  });

  // test('DELETE non-existing Employee', async () => {
  //   const getReq = new NextRequest(baseUrl);
  //   const res = await DELETE(getReq, {
  //     params: Promise.resolve({ accountID: 'non-existing-id' }),
  //   });
  //   expect(res.status).toBe(400);
  // });
});
