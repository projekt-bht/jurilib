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

import type { Employee } from '~/generated/prisma/browser';
import {
  Accessibility,
  AccountType,
  Area,
  Gender,
  Language,
  OrganizationType,
  PriceCategory,
  Pronoun,
} from '~/generated/prisma/enums';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

import { POST as RegisterPOST } from '../authentication/register/route';
import { POST as OrgPOST } from '../organization/route';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET } = await import('@/app/api/employee/route');

describe('Globale Employee Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/employee`;
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

    const resOrga = await OrgPOST(reqOrga);
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

    const resRegister = await RegisterPOST(reqRegister);
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
    expect(cEmployee).not.toBeNull();
  });

  test('GET all Employees in DB', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
