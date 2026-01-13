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
} from '../generated/prisma/enums';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';

// code inspired by:
// https://blog.alexrusin.com/prisma-seeding-quickly-populate-your-database-for-development/

//if no environment Variable is set, default to 10 organizations
const orgAmount: number = process.env.SEED_AMOUNT ? parseInt(process.env.SEED_AMOUNT) : 50;
const orgIds = Array.from({ length: orgAmount }, () => faker.string.uuid());

async function main() {
  // Cleanup for each Seeding - in der richtigen Reihenfolge (abhängige zuerst)

  await prisma.appointment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.service.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.organization.deleteMany();

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
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
