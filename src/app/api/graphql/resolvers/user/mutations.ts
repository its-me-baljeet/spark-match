import { GraphQLContext } from "@/lib/graphql/context";
import { RegisterUserArgs, UpdateUserInput } from "@/types";
import { formatUser } from "@/utils/format-user";
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