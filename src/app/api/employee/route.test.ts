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

import { AccountType, Area, Gender, Language, Pronoun } from '~/generated/prisma/enums';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

import { POST as RegisterPOST } from '../authentication/register/route';
import { POST as OrgPOST } from '../organization/route';

// Alle Imports per await:
const { NextRequest } = await import('next/server');
const { prisma } = await import('@/lib/db');

// Dynamisch die API-Funktionen importieren
const { GET } = await import('@/app/api/employee/route');

// TODO: remove - THIS IS A PIPELINE TEST
describe('Globale Employee Routen testen', () => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/employee`;
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
  const baseUrlOrganization = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization`;

  test('POST Employee through Register Route', async () => {
    // create organization
    const organization: OrganizationCreateInput = {
      name: 'Max Mustermann Kanzlei',
      description: 'Kanzlei test',
      shortDescription: 'Kanzlei shortTest',
      email: Math.random() + '@mail.de',
      type: 'LAW_FIRM',
      priceCategory: 'FREE',
      expertiseAreas: ['Verkehrsrecht', 'Arbeitsrecht'],
      country: 'Deutschland',
      city: 'Berlin',
      zipCode: '10115',
      street: 'Musterstraße',
      houseNumber: '1A',

      averageRating: 4.5,
      numberOfRatings: 10,
    };

    const orgReq = new NextRequest(baseUrlOrganization, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organization),
    });

    const orgRes = await OrgPOST(orgReq);

    const organizationData = await orgRes.json();

    // create employee account
    const registerInput = {
      account: {
        email: 'peter' + Math.random() + '@mail.de',
        password: '1234567890',
        type: AccountType.EMPLOYEE,
      },
      entity: {
        firstname: 'Peter',
        lastname: 'Mustermann',
        gender: Gender.Mann,
        pronoun: Pronoun.er_ihm,
        organizationId: organizationData.id,
        expertiseArea: [Area.Arbeitsrecht, Area.Familienrecht],
        languages: [Language.DEUTSCH, Language.ENGLISCH],
        email: 'peter@contacting.de',
      },
    };

    const req = new NextRequest(baseUrlRegister, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const res = await RegisterPOST(req);
    expect(res!.status).toBe(201);

    const result = await prisma.account.findUnique({
      where: { email: registerInput.account.email },
    });
    expect(result).not.toBeNull();
  });

  test('GET all Employees in DB', async () => {
    const req = new NextRequest(baseUrl);
    const res = await GET(req);
    const json = await res.json();
    expect(json.length).not.toBe(0);
    expect(res.status).toBe(200);
  });
});
export {};
