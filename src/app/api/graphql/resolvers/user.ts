import { GraphQLContext } from "@/types/graphql";
import cloudinary from "@/services/cloudinary";
import { RegisterUserArgs, UpdateUserInput } from "@/types";

/**
 * ✅ Check if user exists by clerkId (not email)
 */
export async function checkExistingUser(
  _parent: unknown,
  args: { clerkId: string },
  ctx: GraphQLContext
) {
  const user = await ctx.db.user.findUnique({ where: { clerkId: args.clerkId } });
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

  const age = Math.floor(
    (Date.now() - new Date(user.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    bio: user.bio,
    gender: user.gender,
    birthday: user.birthday.toISOString(),
    age,
    photos: user.photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((p) => p.url),
    preferences: user.preferences ?? undefined,
    location: user.location,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * ✅ Register a new user with preferences
 */
export async function registerUser(
  _parent: unknown,
  { input }: { input: RegisterUserArgs },
  ctx: GraphQLContext
) {
  const { clerkId, email, name, birthday, bio, gender, location, photos, preferences } = input;

  const existing = await ctx.db.user.findUnique({ where: { clerkId } });
  if (existing) {
    // Return existing user formatted properly
    const age = Math.floor(
      (Date.now() - new Date(existing.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    
    const userWithRelations = await ctx.db.user.findUnique({
      where: { clerkId },
      include: { photos: true, preferences: true },
    });

    return {
      id: existing.id,
      clerkId: existing.clerkId,
      email: existing.email,
      name: existing.name,
      bio: existing.bio,
      gender: existing.gender,
      birthday: existing.birthday.toISOString(),
      age,
      photos: userWithRelations?.photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((p) => p.url) || [],
      preferences: userWithRelations?.preferences ?? undefined,
      location: existing.location,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: existing.updatedAt.toISOString(),
    };
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

  const age = Math.floor(
    (Date.now() - new Date(newUser.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  return {
    id: newUser.id,
    clerkId: newUser.clerkId,
    email: newUser.email,
    name: newUser.name,
    bio: newUser.bio,
    gender: newUser.gender,
    birthday: newUser.birthday.toISOString(),
    age,
    photos: newUser.photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((p) => p.url),
    preferences: newUser.preferences ?? undefined,
    location: newUser.location,
    createdAt: newUser.createdAt.toISOString(),
    updatedAt: newUser.updatedAt.toISOString(),
  };
}

/**
 * ✅ Update an existing user with preferences support
 */
export async function updateUser(
  _parent: unknown,
  { input }: { input: UpdateUserInput },
  ctx: GraphQLContext
) {
  // For now, we'll skip auth check since it's not implemented
  // TODO: Implement proper authentication
  
  // 1️⃣ Fetch user with photos and preferences
  const user = await ctx.db.user.findUnique({
    where: { clerkId: input.clerkId },
    include: { photos: true, preferences: true },
  });
  if (!user) throw new Error("User not found");

  const existingPhotos = user.photos;
  const submitted = input.photos ?? [];

  const submittedIds = new Set(submitted.filter((p) => p.id).map((p) => p.id));
  const toDelete = existingPhotos.filter((p) => !submittedIds.has(p.id));
  const toUpdate = submitted.filter((p) => p.id);
  const toCreate = submitted.filter((p) => !p.id);

  // 2️⃣ Delete removed photos
  await Promise.all(
    toDelete.map(async (p) => {
      try {
        await cloudinary.uploader.destroy(p.publicId);
      } catch (err) {
        console.error("Cloudinary destroy failed:", p.publicId, err);
      }
      try {
        await ctx.db.photo.delete({ where: { id: p.id } });
      } catch (err) {
        console.error("DB delete failed for photo:", p.id, err);
      }
    })
  );

  // 3️⃣ Update existing photos
  await Promise.all(
    toUpdate.map(async (p) => {
      await ctx.db.photo.update({
        where: { id: p.id! },
        data: {
          url: p.url,
          publicId: p.publicId,
          order: p.order ?? 0,
        },
      });
    })
  );

  // 4️⃣ Create new photos
  await Promise.all(
    toCreate.map(async (p) => {
      await ctx.db.photo.create({
        data: {
          user: { connect: { id: user.id } },
          url: p.url,
          publicId: p.publicId,
          order: p.order ?? 0,
        },
      });
    })
  );

  // 5️⃣ Update or create preferences
  if (input.preferences) {
    if (user.preferences) {
      await ctx.db.preference.update({
        where: { userId: user.id },
        data: {
          minAge: input.preferences.minAge,
          maxAge: input.preferences.maxAge,
          distanceKm: input.preferences.distanceKm,
          gender: input.preferences.gender,
        },
      });
    } else {
      await ctx.db.preference.create({
        data: {
          userId: user.id,
          minAge: input.preferences.minAge,
          maxAge: input.preferences.maxAge,
          distanceKm: input.preferences.distanceKm,
          gender: input.preferences.gender,
        },
      });
    }
  }

  // 6️⃣ Update user fields
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

  // 7️⃣ Format return object
  const age = Math.floor(
    (Date.now() - new Date(updatedUser.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  return {
    id: updatedUser.id,
    clerkId: updatedUser.clerkId,
    email: updatedUser.email,
    name: updatedUser.name,
    bio: updatedUser.bio,
    gender: updatedUser.gender,
    birthday: updatedUser.birthday.toISOString(),
    age,
    photos: updatedUser.photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((p) => p.url),
    preferences: updatedUser.preferences ?? undefined,
    location: updatedUser.location,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  };
}