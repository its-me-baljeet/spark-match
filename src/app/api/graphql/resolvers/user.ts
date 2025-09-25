import db from "@/services/prisma";
import { RegisterUserArgs } from "@/types";

export async function checkExistingUser(_: unknown, args: { clerkId: string }) {
  const resp = await db.user.findUnique({ where: { clerkId: args.clerkId } });
  return !!resp;
}

export async function getCurrentUser(_: unknown, { clerkId }: { clerkId: string }) {
  if (!clerkId) return null;

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      images: true, // fetch all user images
      likesSent: true, // optional: include likes if needed
      likesRecv: true,
      matches1: true,
      matches2: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    images: user.images
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((img) => img.url), // only return the URLs for the frontend
  };
}

export async function registerUser(_: unknown, args: { input: RegisterUserArgs }) {
  const { clerkId, name, age, bio, gender, interests, images } = args.input;

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // Create user with images
  return await db.user.create({
    data: {
      clerkId,
      name,
      age,
      bio,
      gender,
      interests,
      images: images
        ? {
            create: images.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              order: img.order?? 0,
            })),
          }
        : undefined,
    },
    include: {
      images: true,
    },
  });
}
