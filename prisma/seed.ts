import { fakerDE as faker } from "@faker-js/faker";
import prisma from "../src/lib/db"
import { Areas, OrganizationType, UserType } from "../generated/prisma/enums";
import { userAgent } from "next/server";
import db from "../src/lib/db";
import { vectorizeExpertiseArea } from "@helper/vectorizer";

// code inspired by:
// https://blog.alexrusin.com/prisma-seeding-quickly-populate-your-database-for-development/

//if no environment Variable is set, default to 10 organizations
const orgAmount: number = process.env.SEED_AMOUNT ? parseInt(process.env.SEED_AMOUNT) : 50;
const orgIds = Array.from({ length: orgAmount }, () => faker.string.uuid());

async function main() {
    // Cleanup for each Seeding

    await prisma.appointment.deleteMany();
    await prisma.request.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

  for (const [i,orgId] of orgIds.entries()) {
  console.log(`ITERATION ${i+1}/${orgIds.length}`)
  // relevant Constants for every creation
  const orgName = faker.company.name();

  const expertiseArea = [faker.helpers.enumValue(Areas)]
  const type = faker.helpers.enumValue(OrganizationType)

  const expertiseVector = await vectorizeExpertiseArea(expertiseArea.toString())

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO "Organization" (
      "id", "name", "description", "email",
      "phone", "address", "website",
      "expertiseArea", "expertiseVector", "type",
      "createdAt", "updatedAt"
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7,
      $8::"Areas"[], $9::vector, $10::"OrganizationType",
      NOW(), NOW()
    )
    `,
    orgId,
    orgName,
    faker.company.catchPhrase(),
    faker.internet.email(),
    faker.phone.number(),
    faker.location.streetAddress(),
    faker.internet.url(),
    expertiseArea,
    expertiseVector,
    type
  );

  console.log(`created "${orgName}" (${orgId})`);

  // Create 2 Users per Organization
  const userIds: string[] = [];
  for (let i=0; i<2;i++){
    const userName = faker.person.fullName();
    const user = await prisma.user.create({
      data:{
        name: userName,
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: faker.helpers.enumValue(UserType),
        organization: { connect: { id: orgId } }
      }
    });
    userIds.push(user.id);
    console.log(`created User ${userName} in Organization`);
  }

  // Create 3 Services per Org
  const serviceIds: string[] = [];
  for (let i=0; i<3; i++) {
    const serviceTitle = faker.commerce.productName();
    const service = await prisma.service.create({
      data: {
        organization: { connect: { id: orgId } },
        title: serviceTitle,
        description: faker.commerce.productDescription(),
        pricingModel: "FIXED"
      }
    });
    serviceIds.push(service.id);
    console.log(`created Service "${serviceTitle}" in Organization`);
  }

  // Create 4 Requests per Org
  const requestIds: string[] = [];
  for (let i=0; i<4; i++) {
    const requestTitle = faker.lorem.words(3);
    const request = await prisma.request.create({
      data: {
        user: { connect: { id: userIds[i % userIds.length] } },
        organization: { connect: { id: orgId } },
        service: { connect: { id: serviceIds[i % serviceIds.length] } },
        title: requestTitle,
        description: faker.lorem.sentence(),
        status: "OPEN"
      }
    });
    requestIds.push(request.id);
    console.log(`created Request "${requestTitle}" in Organization`);
  }

  // Create 5 Appointments per Org
  for (let i=0; i<5; i++) {
    const appointment = await prisma.appointment.create({
      data: {
        request: { connect: { id: requestIds[i % requestIds.length] } },
        user: { connect: { id: userIds[i % userIds.length] } },
        organization: { connect: { id: orgId } },
        duration: faker.number.int({ min: 30, max: 120 }),
        status: "OPEN",
        meetingLink: faker.internet.url()
      }
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