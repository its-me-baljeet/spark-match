import prisma from "@/services/prisma"; // or wherever your prisma client is
async function main() {
  // Find users whose bio contains "@"
  const users = await prisma.user.findMany({
    where: { bio: { contains: "@" } },
  });

  console.log(`Found ${users.length} users to fix...`);

  for (const user of users) {
    if (!user.bio) continue;

    const email = user.bio.trim();

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          bio: "", // clear old bio
        },
      });
      console.log(`Updated user ${user.name} (${user.id})`);
    } catch (err) {
      console.error(`Failed to update user ${user.id}:`, err);
    }
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
