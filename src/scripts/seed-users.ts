import { PrismaClient, Gender } from "../../generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding fake users...");

  const NUM_USERS = 20; // create 20 test users

  for (let i = 0; i < NUM_USERS; i++) {
    const gender = faker.helpers.arrayElement(["MALE", "FEMALE"]) as Gender;

    await prisma.user.create({
      data: {
        clerkId: `test-clerk-${i}`, // fake Clerk IDs
        email: faker.internet.email(),
        name: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        gender,
        birthday: faker.date.birthdate({ min: 18, max: 40, mode: "age" }),
        location: {
          lat: faker.location.latitude({ min: 28.5, max: 28.7 }), // near Delhi
          lng: faker.location.longitude({ min: 77.1, max: 77.3 }),
        },

        photos: {
          create: [
            {
              url: faker.image.avatar(),
              publicId: `fake-public-id-${i}`,
              order: 0,
            },
          ],
        },
        preferences: {
          create: {
            minAge: 18,
            maxAge: 35,
            distanceKm: 50,
            gender: gender === "MALE" ? "FEMALE" : "MALE", // opposite gender preference
          },
        },
      },
    });
  }

  console.log("✅ Done seeding users!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
