import { User, Preference, Photo } from "../../generated/prisma";
import { UserProfile } from "@/types";

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 mins

export function formatUser(
  user: User & { photos: Photo[]; preferences?: Preference | null }
): UserProfile {
  const age = user.birthday
    ? Math.floor(
        (Date.now() - new Date(user.birthday).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : 0;

  const photos = (user.photos ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => p.url);

  const nowUTC = Date.now();
  const lastActiveUTC =
    user.lastActiveAt instanceof Date
      ? user.lastActiveAt.getTime()
      : new Date(user.lastActiveAt).getTime();

  // Prevent future date issue
  const isValidTimestamp = lastActiveUTC <= nowUTC;
  const isOnline =
    isValidTimestamp && nowUTC - lastActiveUTC <= ONLINE_THRESHOLD_MS;

  // console.log({
  //   lastActiveAt: user.lastActiveAt,
  //   lastActiveUTC,
  //   nowUTC,
  //   onlineThreshold: ONLINE_THRESHOLD_MS,
  //   isValidTimestamp,
  //   isOnline,
  // });
  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    age,
    bio: user.bio ?? undefined,
    gender: user.gender,
    birthday: user.birthday ? user.birthday.toISOString() : "",
    photos,
    preferences: user.preferences
      ? {
          minAge: user.preferences.minAge,
          maxAge: user.preferences.maxAge,
          distanceKm: user.preferences.distanceKm,
          gender: user.preferences.gender ?? undefined,
        }
      : undefined,
    location: user.location ?? { lat: 0, lng: 0 },
    lastActiveAt: user.lastActiveAt.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    isOnline,
  };
}
