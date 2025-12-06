import { GraphQLContext } from "@/lib/graphql/context";
import { RegisterUserArgs, UpdateUserInput } from "@/types";
import { formatUser } from "@/utils/format-user";
import { getCityFromCoords } from "@/utils/get-city-from-coords";
import { extractCity } from "@/utils/helper";
import { syncPhotos } from "@/utils/photo-service";
import { syncPreferences } from "@/utils/preference-service";

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
    return formatUser(existing);
  }

const locationData = await getCityFromCoords(location.lat, location.lng);

const city = extractCity(locationData);


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
      city: city
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

const locationData = await getCityFromCoords(input.location.lat, input.location.lng);

const city = extractCity(locationData);

  // 🧑 Update user profile
  const updatedUser = await ctx.db.user.update({
    where: { id: user.id },
    data: {
      name: input.name,
      bio: input.bio ?? undefined,
      gender: input.gender,
      birthday: new Date(input.birthday),
      location: input.location,
      city: city
    },
    include: { photos: true, preferences: true },
  });

  return formatUser(updatedUser);
}

export async function deleteMatch(
  _parent: unknown,
  { userId }: { userId: string },
  ctx: GraphQLContext
) {
  try {
    const matchParticipant = await ctx.db.matchParticipant.findFirst({
      where: { userId },
    });

    if (!matchParticipant) throw new Error("Match not found");

    // Get all participants in this match
    const allParticipants = await ctx.db.matchParticipant.findMany({
      where: { matchId: matchParticipant.matchId },
    });

    // Extract user IDs
    const userIds = allParticipants.map((p) => p.userId);

    // Delete mutual likes between these users to prevent auto-matching again
    if (userIds.length === 2) {
      await ctx.db.like.deleteMany({
        where: {
          OR: [
            { fromUserId: userIds[0], toUserId: userIds[1] },
            { fromUserId: userIds[1], toUserId: userIds[0] },
          ],
        },
      });
    }

    // Delete all participants first to avoid relation constraint violation
    await ctx.db.matchParticipant.deleteMany({
      where: { matchId: matchParticipant.matchId },
    });

    // Then delete the match
    await ctx.db.match.delete({
      where: { id: matchParticipant.matchId },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
