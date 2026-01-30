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

jest.unstable_mockModule('@/app/api/authentication/login/JWTService', () => ({
  verifyJWT: jest.fn(),
}));

// Non-mock related implementation:

import type { Appointment } from '~/generated/prisma/client';
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
const { GET: appointmentsByEmployeeGET, POST: appointmentPOST } =
  await import('@/app/api/appointment/employee/[employeeID]/route');
const { POST: employeePOST } = await import('@/app/api/authentication/register/route');
const { verifyJWT } = await import('@/app/api/authentication/login/JWTService');

describe('Appointment Employee Endpoint api/appointment/employee/[employeeID] testen', () => {
  const placeholderUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}`;
  let cEmployee: Employee;

  beforeAll(async () => {
    (verifyJWT as jest.Mock).mockReturnValue({
      employeeId: 1231,
      id: 1231241,
    });
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

    const reqOrga = new NextRequest(placeholderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organization),
    });

    const resOrga = await orgPOST(reqOrga);
    const createdOrga = await resOrga.json();

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

    const reqRegister = new NextRequest(placeholderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const resRegister = await employeePOST(reqRegister);

    const createdEmployee = await resRegister?.json();
    cEmployee = createdEmployee;
  });

  test('GET non-existing Employee', async () => {
    const req = new NextRequest(placeholderUrl);
    const res = await appointmentsByEmployeeGET(req, {
      params: Promise.resolve({ employeeID: '00000000-4af3-4b8c-8601-000000000000' }),
    });
    expect(res.status).toBe(404);
  });

  test('POST new Appointment', async () => {
    (verifyJWT as jest.Mock).mockReturnValue({
      employeeId: cEmployee.id,
      id: cEmployee.accountId,
    });

    const postReq = new NextRequest(placeholderUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'access_token=fake-token',
      },
      body: JSON.stringify({
        dateTimeStart: '2026-04-04T23:31:00.000Z',
        duration: 60,
      }),
    });

    const res = await appointmentPOST(postReq, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });

    expect(res.status).toBe(201);
    const cAppointment: Appointment = await res.json();

    const created = await prisma.appointment.findUnique({
      where: { id: cAppointment.id },
    });

    expect(created?.duration).toBe(60);
  });

  test('GET all Appointments by an Employee', async () => {
    const req = new NextRequest(placeholderUrl);
    const res = await appointmentsByEmployeeGET(req, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });

  test('POST Appointment with invalid data', async () => {
    const postReq = new NextRequest(placeholderUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'access_token=fake-token',
      },
      body: JSON.stringify({
        dateTimeStart: '2026-04-04T23:31:00.000Z',
        duration: 60,
        keks: 'sehr keksig',
      }),
    });

    const res = await appointmentPOST(postReq, {
      params: Promise.resolve({ employeeID: cEmployee.id }),
    });

    expect(res.status).toBe(400);
  });
});
