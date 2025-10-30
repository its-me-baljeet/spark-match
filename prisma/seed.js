// prisma/seed.js
import { PrismaClient } from "../generated/prisma/index.js";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();
const GENDERS = ["MALE", "FEMALE", "OTHER"];

async function main() {
  console.log("🌱 Starting to seed users...");

  for (let i = 0; i < 20; i++) {
    const gender = faker.helpers.arrayElement(GENDERS);

    await db.user.create({
      data: {
        clerkId: faker.string.uuid(),
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        birthday: faker.date.birthdate({ min: 18, max: 35, mode: "age" }),
        gender,
        location: {
          lat: parseFloat(faker.location.latitude({ min: 28.5, max: 28.7 })),
          lng: parseFloat(faker.location.longitude({ min: 77.1, max: 77.3 })),
        },
        photos: {
          create: [
            {
              url: faker.image.avatar(),
              publicId: faker.string.uuid(),
              order: 0,
            },
          ],
        },
        preferences: {
          create: {
            minAge: faker.number.int({ min: 18, max: 25 }),
            maxAge: faker.number.int({ min: 26, max: 35 }),
            distanceKm: faker.number.int({ min: 5, max: 30 }),
            gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
          },
        },
      },
    });
  }

  console.log("✅ Done seeding!");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seeding error:", error);
    await db.$disconnect();
    process.exit(1);
  });
