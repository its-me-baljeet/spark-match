import { GraphQLContext } from "@/lib/graphql/context";
import { formatUser } from "@/utils/format-user";
import { Prisma } from "../../../../../../generated/prisma";
import db from "@/services/prisma";

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
    currentLocation?: { lat: number; lng: number };
  },
  ctx: GraphQLContext
) {
  const {
    limit = 10,
    cursor,
    clerkId,
    distanceKm,
    onlyOnline,
    currentLocation,
  } = args;

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
  // 🔥 Online filter
  if (onlyOnline) {
    const threshold = new Date(Date.now() - 5 * 60 * 1000);
    where.lastActiveAt = { gte: threshold };
  }

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

  let users = await ctx.db.user.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    include: { photos: true, preferences: true },
    orderBy: { createdAt: "desc" },
  });

if (distanceKm) {
  const origin = currentLocation ?? currentUser.location;
  const toRad = (v: number) => (v * Math.PI) / 180;

  users = users.filter((u) => {
    if (!u.location) return false;

    const d =
      6371 *
      Math.acos(
        Math.sin(toRad(origin.lat)) *
          Math.sin(toRad(u.location.lat)) +
          Math.cos(toRad(origin.lat)) *
            Math.cos(toRad(u.location.lat)) *
            Math.cos(toRad(u.location.lng - origin.lng))
      );

    return d <= distanceKm;
  });
}


  return users.map(formatUser);
}

export async function getUsersWhoLikedMe(
  _parent: unknown,
  args: { clerkId: string },
  ctx: GraphQLContext
) {
  const { clerkId } = args;

  const currentUser = await ctx.db.user.findUnique({ where: { clerkId } });
  if (!currentUser) throw new Error("User not found");

  await ctx.db.user.update({
    where: { clerkId },
    data: { lastActiveAt: new Date() },
  });

  // 0️⃣ Get matches using existing resolver
  const matches = await getMyMatches(_parent, { clerkId }, ctx);
  const matchedUserIds = matches.map((u) => u.id);

  const users = await ctx.db.user.findMany({
    where: {
      // 1️⃣ They liked me
      likesSent: {
        some: { toUserId: currentUser.id },
      },

      // 2️⃣ I haven't liked them back
      likesReceived: {
        none: { fromUserId: currentUser.id },
      },

      // 3️⃣ I haven't passed them either
      passSent: {
        none: { fromUserId: currentUser.id },
      },

      // 4️⃣ Ignore my own profile
      clerkId: { not: clerkId },

      // 5️⃣ Exclude already matched users
      id: { notIn: matchedUserIds },
    },
    include: { photos: true, preferences: true },
  });

  return users.map(formatUser);
}

export async function getMyMatches(
  _parent: unknown,
  args: { clerkId: string },
  ctx: GraphQLContext
) {
  const { clerkId } = args;

  // Get current user
  const currentUser = await ctx.db.user.findUnique({ where: { clerkId } });
  if (!currentUser) throw new Error("User not found");

  await ctx.db.user.update({
    where: { clerkId },
    data: { lastActiveAt: new Date() },
  });
  // Find matches where user participates
  const matches = await ctx.db.matchParticipant.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      match: {
        include: {
          participants: {
            include: {
              user: { include: { photos: true } },
            },
          },
        },
      },
    },
  });

  // Extract the other participant
  const matchedUsers = matches
    .map(
      (m) => m.match.participants.find((p) => p.userId !== currentUser.id)?.user
    )
    .filter((u): u is NonNullable<typeof u> => !!u); // type-safe filter

  return matchedUsers.map(formatUser);
}

export async function getUserById(
  _parent: unknown,
  { userId }: { userId: string }
) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        photos: true,
        preferences: true,
      },
    });
    if (!user) throw new Error("User not found");
    return formatUser(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}
