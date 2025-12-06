import { fakerDE as faker } from '@faker-js/faker';
import prisma from '../src/lib/db';
import {
  Areas,
  OrganizationType,
  PriceCategory,
  ServiceType,
  Role,
} from '../generated/prisma/enums';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';

// code inspired by:
// https://blog.alexrusin.com/prisma-seeding-quickly-populate-your-database-for-development/

//if no environment Variable is set, default to 10 organizations
const orgAmount: number = process.env.SEED_AMOUNT ? parseInt(process.env.SEED_AMOUNT) : 50;
const orgIds = Array.from({ length: orgAmount }, () => faker.string.uuid());

async function main() {
  // Cleanup for each Seeding

  await prisma.appointment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.account.deleteMany();
  await prisma.organization.deleteMany();

  // Create 20 Users with accounts
  const userIds: string[] = [];
  for (let i = 0; i < 20; i++) {
    const userName = faker.person.fullName();

    const account = await prisma.account.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Role.USER,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: userName,
        accountId: account.id,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
      },
    });
    userIds.push(user.id);
    console.log(`created User ${userName} with accID ${account.id}`);
  }

  // Create Organizations with related Data
  for (const [i, orgId] of orgIds.entries()) {
    console.log(`ITERATION ${i + 1}/${orgIds.length}`);
    // relevant Constants for every creation
    const orgName = faker.company.name();

    const expertiseArea = [faker.helpers.enumValue(Areas)];
    const type = faker.helpers.enumValue(OrganizationType);

    let expertiseVector = null;
    if (process.env.OPENAI_API_KEY) {
      expertiseVector = await vectorizeExpertiseArea(expertiseArea.toString());
    }

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "Organization" (
        "id", "name", "description", "shortDescription", "email",
        "phone", "address", "website",
        "expertiseArea", "expertiseVector", "type", "priceCategory",
        "createdAt", "updatedAt"
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9::"Areas"[], $10::vector, $11::"OrganizationType", $12::"PriceCategory",
        NOW(), NOW()
      )
      `,
      orgId,
      orgName,
      faker.company.catchPhrase(),
      faker.company.catchPhrase(),
      faker.internet.email(),
      faker.phone.number(),
      faker.location.streetAddress(),
      faker.internet.url(),
      expertiseArea,
      expertiseVector,
      type,
      faker.helpers.enumValue(PriceCategory)
    );

    console.log(`created "${orgName}" (${orgId})`);

    // Create 5 Employees per Org
    const employeeId: string[] = [];
    for (let i = 0; i < 5; i++) {
      const account = await prisma.account.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: Role.EMPLOYEE,
        },
      });

      const employeeName = faker.person.fullName();
      const employee = await prisma.employee.create({
        data: {
          name: employeeName,
          organization: { connect: { id: orgId } },
          phone: faker.phone.number(),
          position: faker.person.jobTitle(),
          account: { connect: { id: account.id } },
        },
      });
      employeeId.push(employee.id);
      console.log(`created Employee ${employeeName} in Organization`);
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
          organization: { connect: { id: orgId } },
          employee: { connect: { id: employeeId[i % employeeId.length] } },
          service: { connect: { id: serviceIds[i % serviceIds.length] } },
          title: caseTitle,
          description: faker.lorem.sentence(),
          status: 'OPEN',
        },
      });
      caseIds.push(caseItem.id);
      console.log(`created Case "${caseTitle}" in Organization`);
    }

    // Create 5 Appointments per Org
    for (let i = 0; i < 5; i++) {
      const appointment = await prisma.appointment.create({
        data: {
          case: { connect: { id: caseIds[i % caseIds.length] } },
          user: { connect: { id: userIds[i % userIds.length] } },
          organization: { connect: { id: orgId } },
          employee: { connect: { id: employeeId[i % employeeId.length] } },
          service: { connect: { id: serviceIds[i % serviceIds.length] } },
          duration: faker.number.int({ min: 30, max: 120 }),
          status: 'OPEN',
          meetingLink: faker.internet.url(),
          dateTime: faker.date.future(),
          timeZone: faker.location.timeZone(),
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
