import { fakerDE as faker } from '@faker-js/faker';
import prisma from '../src/lib/db';
import {
  Area,
  OrganizationType,
  PriceCategory,
  ServiceType,
  AccountType,
  Gender,
  Pronoun,
  Language,
  Accessibility,
  AppointmentStatus,
  PricingModel,
} from '../generated/prisma/enums';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import * as fs from 'fs';
import * as path from 'path';

// code inspired by:
// https://blog.alexrusin.com/prisma-seeding-quickly-populate-your-database-for-development/

//if no environment Variable is set, default to 10 organizations
const orgAmount: number = process.env.SEED_AMOUNT ? parseInt(process.env.SEED_AMOUNT) : 50;
const orgIds = Array.from({ length: orgAmount }, () => faker.string.uuid());

// Load production data from JSON files
const prodDataPath = path.join(process.cwd(), 'prisma', 'proddata');
let organizationsData: any[] = [];
let employeesData: any[] = [];
let servicesData: any[] = [];
let appointmentsData: any[] = [];

if (process.env.NODE_ENV === 'production') {
  organizationsData = JSON.parse(
    fs.readFileSync(path.join(prodDataPath, 'organizations.json'), 'utf-8')
  );
  employeesData = JSON.parse(fs.readFileSync(path.join(prodDataPath, 'employees.json'), 'utf-8'));
  servicesData = JSON.parse(fs.readFileSync(path.join(prodDataPath, 'services.json'), 'utf-8'));
  appointmentsData = JSON.parse(
    fs.readFileSync(path.join(prodDataPath, 'appointments.json'), 'utf-8')
  );
}

async function main() {
  // Cleanup for each Seeding - in der richtigen Reihenfolge (abhängige zuerst)
  console.log('\nCleaning up existing data...');
  await prisma.appointment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.service.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.accountToken.deleteMany();
  await prisma.account.deleteMany();
  await prisma.organization.deleteMany();
  console.log('Database cleanup complete\n');

  if (process.env.NODE_ENV === 'development') {
    console.log('DEV Seed started...');

    // Create 20 Users with accounts
    const userIds: string[] = [];
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const account = await prisma.account.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          type: AccountType.USER,
          isVerified: true,
        },
      });

      const user = await prisma.user.create({
        data: {
          firstname: firstName,
          lastname: lastName,
          gender: faker.helpers.enumValue(Gender),
          pronoun: faker.helpers.enumValue(Pronoun),
          birthdate: faker.date.past({ years: 20, refDate: '2005-01-01' }),

          phone: faker.phone.number(),
          country: faker.location.country(),
          city: faker.location.city(),
          zipCode: faker.location.zipCode(),
          street: faker.location.street(),
          houseNumber: faker.location.buildingNumber(),
          account: { connect: { id: account.id } },
        },
      });
      userIds.push(user.id);
      console.log(`created User ${firstName} ${lastName} with accID ${account.id}`);
    }

    // Create Organizations with related Data
    for (const [i, orgId] of orgIds.entries()) {
      console.log(`ITERATION ${i + 1}/${orgIds.length}`);
      // relevant Constants for every creation
      const orgName = faker.company.name();

      const expertiseArea = [faker.helpers.enumValue(Area)];
      const type = faker.helpers.enumValue(OrganizationType);
      const accessibility = [faker.helpers.enumValue(Accessibility)];

      let expertiseVector = null;
      if (process.env.OPENAI_API_KEY) {
        expertiseVector = await vectorizeExpertiseArea(expertiseArea.toString());
      }

      const org = await prisma.organization.create({
        data: {
          id: orgId,
          name: orgName,
          description: faker.company.catchPhrase(),
          shortDescription: faker.company.catchPhrase(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          website: faker.internet.url(),
          accessibility: accessibility,
          expertiseAreas: expertiseArea,
          type: type,
          priceCategory: faker.helpers.enumValue(PriceCategory),
          country: faker.location.country(),
          city: faker.location.city(),
          zipCode: faker.location.zipCode(),
          street: faker.location.street(),
          houseNumber: faker.location.buildingNumber(),
          imageUrl: faker.image.url(),
          averageRating: faker.number.int({ min: 1, max: 5 }),
          numberOfRatings: faker.number.int({ min: 0, max: 1000 }),
        },
      });

      if (expertiseVector) {
        await prisma.$executeRawUnsafe(
          `UPDATE "Organization" SET "expertiseVector" = $1 WHERE id = $2`,
          expertiseVector,
          orgId
        );
      }

      console.log(`created "${orgName}" (${orgId})`);

      // Create 5 Employees per Org
      const employeeId: string[] = [];
      for (let i = 0; i < 5; i++) {
        const account = await prisma.account.create({
          data: {
            email: faker.internet.email(),
            password: faker.internet.password(),
            type: AccountType.EMPLOYEE,
          },
        });

        const languages: Language[] = [];
        for (let k = 0; k < 2; k++) {
          languages.push(faker.helpers.enumValue(Language));
        }

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const employee = await prisma.employee.create({
          data: {
            firstname: firstName,
            lastname: lastName,
            gender: faker.helpers.enumValue(Gender),
            pronoun: faker.helpers.enumValue(Pronoun),
            email: faker.internet.email(),
            organization: { connect: { id: orgId } },
            phone: faker.phone.number(),
            position: faker.person.jobTitle(),
            account: { connect: { id: account.id } },
            expertiseAreas: [faker.helpers.enumValue(Area)],
            languages: languages,
          },
        });
        employeeId.push(employee.id);
        console.log(`created Employee ${firstName} ${lastName} in Organization`);
      }

      // Create 3 Services per Org
      const serviceIds: string[] = [];
      for (let i = 0; i < 3; i++) {
        const serviceTitle = faker.commerce.productName();
        const service = await prisma.service.create({
          data: {
            organization: { connect: { id: orgId } },
            title: serviceTitle,
            description: faker.commerce.productDescription(),
            type: faker.helpers.enumValue(ServiceType),
            pricingModel: 'FIXED',
            price: parseFloat(faker.commerce.price({ min: 50, max: 500, dec: 2 })),
            defaultDuration: faker.number.int({ min: 30, max: 120 }),
          },
        });
        serviceIds.push(service.id);
        console.log(`created Service "${serviceTitle}" in Organization`);
      }

      // Create 4 Cases per Org
      const caseIds: string[] = [];
      for (let i = 0; i < 4; i++) {
        const caseTitle = faker.lorem.words(3);
        const caseItem = await prisma.case.create({
          data: {
            user: { connect: { id: userIds[i % userIds.length] } },
            employee: { connect: { id: employeeId[i % employeeId.length] } },
            title: caseTitle,
            description: faker.lorem.sentence(),
            status: 'OPEN',
          },
        });
        caseIds.push(caseItem.id);
        console.log(`created Case "${caseTitle}" in Organization`);
      }

      // Create 50 Appointments per Org
      for (let i = 0; i < 50; i++) {
        // creating ralistic appointment times
        const hour = faker.number.int({ min: 8, max: 21 });
        const minute = faker.helpers.arrayElement([0, 15, 30, 45]);
        const dateTimeStart = faker.date.future();
        // replace random hour and minute within business hours
        dateTimeStart.setHours(hour, minute, 0, 0);
        const duration = faker.helpers.arrayElement([15, 30, 45, 60, 90, 120]);
        const dateTimeEnd = new Date(dateTimeStart.getTime() + duration * 60000);

        const appointment = await prisma.appointment.create({
          data: {
            case: { connect: { id: caseIds[i % caseIds.length] } },
            user: { connect: { id: userIds[i % userIds.length] } },
            employee: { connect: { id: employeeId[i % employeeId.length] } },

            duration: duration,
            status: 'OPEN',
            meetingLink: faker.internet.url(),
            dateTimeStart: dateTimeStart,
            dateTimeEnd: dateTimeEnd,
            notes: faker.lorem.sentence(),
          },
        });
        console.log(`created Appointment (${appointment.id}) in Organization`);
      }

      console.log();
    }
  } else {
    console.log('PROD Seed started...');
    console.log(`Loading ${organizationsData.length} organizations...`);
    console.log(`Loading ${employeesData.length} employees...`);
    console.log(`Loading ${servicesData.length} services...`);
    console.log(`Loading ${appointmentsData.length} appointments...`);

    // Create Organizations
    console.log('Creating organizations...');
    const orgIdentifierToId: Map<string, string> = new Map();

    for (const [index, orgData] of organizationsData.entries()) {
      const expertiseAreas = orgData.expertiseAreas as Area[];
      const accessibility = orgData.accessibility as Accessibility[];

      let expertiseVector = null;
      if (process.env.OPENAI_API_KEY) {
        expertiseVector = await vectorizeExpertiseArea(expertiseAreas.toString());
      }

      const org = await prisma.organization.create({
        data: {
          name: orgData.name,
          description: orgData.description,
          shortDescription: orgData.shortDescription,
          email: orgData.email,
          phone: orgData.phone || undefined,
          website: orgData.website || undefined,
          imageUrl: orgData.imageUrl || undefined,
          accessibility: accessibility,
          expertiseAreas: expertiseAreas,
          type: orgData.type as OrganizationType,
          priceCategory: orgData.priceCategory as PriceCategory,
          country: orgData.country,
          city: orgData.city,
          zipCode: orgData.zipCode,
          street: orgData.street,
          houseNumber: orgData.houseNumber,
          averageRating: orgData.averageRating,
          numberOfRatings: orgData.numberOfRatings,
        },
      });

      if (expertiseVector) {
        await prisma.$executeRawUnsafe(
          `UPDATE "Organization" SET "expertiseVector" = $1 WHERE id = $2`,
          expertiseVector,
          org.id
        );
      }

      orgIdentifierToId.set(orgData.identifier, org.id);

      if ((index + 1) % 25 === 0) {
        console.log(`  Created ${index + 1}/${organizationsData.length} organizations...`);
      }
    }
    console.log(`Created ${organizationsData.length} organizations\n`);

    // Create Employees with Accounts
    console.log('Creating employees...');
    const employeeEmailToId: Map<string, string> = new Map();

    for (const [index, empData] of employeesData.entries()) {
      const orgId = orgIdentifierToId.get(empData.organizationIdentifier);
      if (!orgId) {
        console.warn(
          `Organization ${empData.organizationIdentifier} not found for employee ${empData.email}`
        );
        continue;
      }

      // Create Account for Employee
      const account = await prisma.account.create({
        data: {
          email: empData.email,
          password: '12345_Lachs', // Use a default hashed password
          type: AccountType.EMPLOYEE,
          isVerified: false,
        },
      });

      const expertiseAreas = empData.expertiseAreas as Area[];
      const languages = empData.languages as Language[];

      const employee = await prisma.employee.create({
        data: {
          accountId: account.id,
          title: empData.title || undefined,
          firstname: empData.firstname,
          lastname: empData.lastname,
          pronoun: empData.pronoun ? (empData.pronoun as Pronoun) : undefined,
          pronounText: empData.pronounText || undefined,
          gender: empData.gender as Gender,
          genderText: empData.genderText || undefined,
          imageUrl: empData.imageUrl || undefined,
          phone: empData.phone || undefined,
          organizationId: orgId,
          position: empData.position || undefined,
          email: empData.email,
          description: empData.description || undefined,
          expertiseAreas: expertiseAreas,
          languages: languages,
        },
      });

      employeeEmailToId.set(empData.email, employee.id);

      if ((index + 1) % 100 === 0) {
        console.log(`  Created ${index + 1}/${employeesData.length} employees...`);
      }
    }
    console.log(`Created ${employeesData.length} employees\n`);

    // Create Services
    console.log('Creating services...');
    for (const [index, serviceData] of servicesData.entries()) {
      const orgId = orgIdentifierToId.get(serviceData.organizationIdentifier);
      if (!orgId) {
        console.warn(
          `Organization ${serviceData.organizationIdentifier} not found for service ${serviceData.identifier}`
        );
        continue;
      }

      await prisma.service.create({
        data: {
          organizationId: orgId,
          title: serviceData.title,
          description: serviceData.description,
          type: serviceData.type as ServiceType,
          pricingModel: serviceData.pricingModel as PricingModel,
          price: serviceData.price,
          defaultDuration: serviceData.defaultDuration,
        },
      });

      if ((index + 1) % 100 === 0) {
        console.log(`  Created ${index + 1}/${servicesData.length} services...`);
      }
    }
    console.log(`Created ${servicesData.length} services\n`);

    // Create Appointments
    console.log('Creating appointments...');
    for (const [index, apptData] of appointmentsData.entries()) {
      const orgId = orgIdentifierToId.get(apptData.organizationIdentifier);
      const employeeId = employeeEmailToId.get(apptData.employeeEmail);

      if (!orgId) {
        console.warn(`Organization ${apptData.organizationIdentifier} not found for appointment`);
        continue;
      }

      if (!employeeId) {
        console.warn(`Employee ${apptData.employeeEmail} not found for appointment`);
        continue;
      }

      await prisma.appointment.create({
        data: {
          employeeId: employeeId,
          duration: apptData.duration,
          status: apptData.status as AppointmentStatus,
          location: apptData.location || undefined,
          meetingLink: apptData.meetingLink || undefined,
          dateTimeStart: new Date(apptData.dateTimeStart),
          dateTimeEnd: new Date(apptData.dateTimeEnd),
          notes: apptData.notes || undefined,
          // caseId and userId are optional and not in prod data
        },
      });

      if ((index + 1) % 1000 === 0) {
        console.log(`  Created ${index + 1}/${appointmentsData.length} appointments...`);
      }
    }
    console.log(`Created ${appointmentsData.length} appointments\n`);

    console.log('PROD Seed completed successfully!');
    console.log('\nSummary:');
    console.log(`   Organizations: ${organizationsData.length}`);
    console.log(`   Employees: ${employeesData.length}`);
    console.log(`   Services: ${servicesData.length}`);
    console.log(`   Appointments: ${appointmentsData.length}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
