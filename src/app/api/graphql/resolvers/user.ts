import db from "@/services/prisma";
import { RegisterUserArgs } from "@/types";

export async function checkExistingUser(_: unknown, args: { clerkId: string }) {
  const resp = await db.user.findUnique({ where: { clerkId: args.clerkId } });
  return !!resp;
}

export async function registerUser(_: unknown, args: RegisterUserArgs) {
  const { clerkId, name, age, bio, gender, interests } = args;

  // Check if already exists
  const existing = await db.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // Create new user
  return await db.user.create({
    data: {
      clerkId,
      name,
      age,
      bio,
      gender,
      interests,
    },
  });
}
