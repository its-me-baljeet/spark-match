import { RegisterUserArgs, UpdateUserInput } from "@/types";
import { GraphQLContext } from "@/types/graphql";
import { formatUser } from "@/utils/format-user";
import { syncPhotos } from "@/utils/photo-service";
import { syncPreferences } from "@/utils/preference-service";
import { Prisma } from "../../../../../generated/prisma";

/**
 * ✅ Check if user exists by clerkId (not email)
 */
export async function checkExistingUser(
  _parent: unknown,
  args: { clerkId: string },
  ctx: GraphQLContext
) {
  const user = await ctx.db.user.findUnique({
    where: { clerkId: args.clerkId },
  });
  return !!user;
}

/**
 * Get the current user with related data
 */
export async function getCurrentUser(
  _parent: unknown,
  { clerkId }: { clerkId: string },
  ctx: GraphQLContext
) {
  if (!clerkId) return null;

  const user = await ctx.db.user.findUnique({
    where: { clerkId },
    include: { photos: true, preferences: true },
  });

  if (!user) return null;

  return user ? formatUser(user) : null;
}

export async function getPreferredUsers(
  _parent: unknown,
  args: { limit?: number; cursor?: string; clerkId: string },
  ctx: GraphQLContext
) {
  const { limit = 10, cursor, clerkId } = args;

  
  // 1. Get the current user (needed for preferences filtering)
  if (!clerkId) throw new Error("Unauthorized");

  const currentUser = await ctx.db.user.findUnique({
    where: { clerkId },
    include: { preferences: true },
  });

  if (!currentUser) throw new Error("User not found");

  // 2. Build filters based on preferences
  const where: Prisma.UserWhereInput = {};

  if (currentUser.preferences) {
    const { minAge, maxAge, gender, distanceKm } = currentUser.preferences;

    // Age filter
    const today = new Date();
    const maxBirthday = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    );
    const minBirthday = new Date(
      today.getFullYear() - maxAge,
      today.getMonth(),
      today.getDate()
    );

    where.birthday = {
      gte: minBirthday, // older than maxAge
      lte: maxBirthday, // younger than minAge
    };

    // Gender filter
    if (gender) {
      where.gender = gender;
    }

    // TODO: Distance filter
    // For now, skipping geospatial logic.
    // You’d normally do haversine formula + raw query, or PostGIS / MongoDB geo queries.
  }

  // 3. Fetch paginated users
  const users = await ctx.db.user.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      ...where,
      clerkId: { not: clerkId }, // exclude self
    },
    include: { photos: true, preferences: true },
    orderBy: { createdAt: "desc" },
  });

  // 4. Map DB → GraphQL types
  return users.map(formatUser);
}

/**
 * ✅ Register a new user with preferences
 */
export async function registerUser(
  _parent: unknown,
  { input }: { input: RegisterUserArgs },
  ctx: GraphQLContext
) {
  const {
    clerkId,
    email,
    name,
    birthday,
    bio,
    gender,
    location,
    photos,
    preferences,
  } = input;

  const existing = await ctx.db.user.findUnique({
    where: { clerkId },
    include: { photos: true, preferences: true },
  });

  if (existing) {
    return formatUser(existing); // ✅ no repetition
  }

  const newUser = await ctx.db.user.create({
    data: {
      clerkId,
      email,
      name,
      birthday: new Date(birthday),
      bio,
      gender,
      location,
      photos: photos
        ? {
            create: photos.map((p) => ({
              url: p.url,
              publicId: p.publicId,
              order: p.order ?? 0,
            })),
          }
        : undefined,
      preferences: preferences
        ? {
            create: {
              minAge: preferences.minAge,
              maxAge: preferences.maxAge,
              distanceKm: preferences.distanceKm,
              gender: preferences.gender,
            },
          }
        : undefined,
    },
    include: { photos: true, preferences: true },
  });

  return formatUser(newUser);
}

/**
 * ✅ Update an existing user with preferences support
 */
export async function updateUser(
  _parent: unknown,
  { input }: { input: UpdateUserInput },
  ctx: GraphQLContext
) {
  const user = await ctx.db.user.findUnique({
    where: { clerkId: input.clerkId },
    include: { photos: true, preferences: true },
  });
  if (!user) throw new Error("User not found");

  // 🖼️ Handle photo
  await syncPhotos(
    user.id,
    user.photos,
    (input.photos ?? []).map((p) => ({
      ...p,
      order: p.order ?? undefined, // normalize null → undefined
    }))
  );

  // ⚙️ Handle preferences
  await syncPreferences(user.id, input.preferences);

  // 🧑 Update user profile
  const updatedUser = await ctx.db.user.update({
    where: { id: user.id },
    data: {
      name: input.name,
      bio: input.bio ?? undefined,
      gender: input.gender,
      birthday: new Date(input.birthday),
      location: input.location,
    },
    include: { photos: true, preferences: true },
  });

  return formatUser(updatedUser);
}
