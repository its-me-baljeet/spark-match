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

  await ctx.db.user.update({
    where: { clerkId },
    data: { lastActiveAt: new Date() },
  });

  const user = await ctx.db.user.findUnique({
    where: { clerkId },
    include: { photos: true, preferences: true },
  });

  if (!user) return null;

  return user ? formatUser(user) : null;
}

export async function getPreferredUsers(
  _parent: unknown,
  args: {
    limit?: number;
    cursor?: string;
    clerkId: string;
    distanceKm?: number;
    onlyOnline?: boolean;
  },
  ctx: GraphQLContext
) {
  const { limit = 10, cursor, clerkId, distanceKm, onlyOnline } = args;

  await ctx.db.user.update({
    where: { clerkId },
    data: { lastActiveAt: new Date() },
  });

  const currentUser = await ctx.db.user.findUnique({
    where: { clerkId },
    include: { preferences: true },
  });

  if (!currentUser) throw new Error("User not found");

  const likedUsers = await ctx.db.like.findMany({
    where: { fromUserId: currentUser.id },
    select: { toUserId: true },
  });

  const likedUserIds = likedUsers.map((like) => like.toUserId);

  const passedUsers = await ctx.db.pass.findMany({
    where: { fromUserId: currentUser.id },
    select: { toUserId: true },
  });

  const passedUserIds = passedUsers.map((pass) => pass.toUserId);

  const where: Prisma.UserWhereInput = {
    id: { notIn: [...likedUserIds, ...passedUserIds] },
    clerkId: { not: clerkId },
  };

  if (currentUser.preferences) {
    const { minAge, maxAge, gender } = currentUser.preferences;
    const today = new Date();

    where.birthday = {
      gte: new Date(
        today.getFullYear() - maxAge,
        today.getMonth(),
        today.getDate()
      ),
      lte: new Date(
        today.getFullYear() - minAge,
        today.getMonth(),
        today.getDate()
      ),
    };

    if (gender) where.gender = gender;
  }

  // 🔥 Online filter
  if (onlyOnline) {
    const threshold = new Date(Date.now() - 5 * 60 * 1000);
    where.lastActiveAt = { gte: threshold };
  }

  // 📍 Distance filter (simple bounding box approximation)
  // if (distanceKm) {
  //   const { lat, lng } = currentUser.location;
  //   const degreeOffset = distanceKm / 111; // Rough 111 km per degree
  //   where.location = {
  //     lat: { gte: lat - degreeOffset, lte: lat + degreeOffset },
  //     lng: { gte: lng - degreeOffset, lte: lng + degreeOffset },
  //   };
  // }

  let users = await ctx.db.user.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    include: { photos: true, preferences: true },
    orderBy: { createdAt: "desc" },
  });

  if (distanceKm && currentUser.location) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    users = users.filter((u) => {
      if (!u.location) return false; // If no location, exclude user

      const d =
        6371 *
        Math.acos(
          Math.sin(toRad(currentUser.location.lat)) *
            Math.sin(toRad(u.location.lat)) +
            Math.cos(toRad(currentUser.location.lat)) *
              Math.cos(toRad(u.location.lat)) *
              Math.cos(toRad(u.location.lng - currentUser.location.lng))
        );

      return d <= distanceKm;
    });
  }

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

  await ctx.db.user.update({
    where: { clerkId: input.clerkId },
    data: { lastActiveAt: new Date() },
  });

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

// In your GraphQL mutation resolver
export async function passUser(
  _parent: unknown,
  { fromClerkId, toUserId }: { fromClerkId: string; toUserId: string },
  ctx: GraphQLContext
) {
  const fromUser = await ctx.db.user.findUnique({
    where: { clerkId: fromClerkId },
  });
  if (!fromUser) throw new Error("User not found");

  await ctx.db.pass.create({
    data: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });

  return true;
}
