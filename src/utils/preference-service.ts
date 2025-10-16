// utils/preferenceService.ts
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface PreferenceInput {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
}

export async function syncPreferences(
  userId: string,
  input?: PreferenceInput
) {
  if (!input) return;

  const existing = await prisma.preference.findUnique({ where: { userId } });

  if (existing) {
    await prisma.preference.update({
      where: { userId },
      data: {
        minAge: input.minAge,
        maxAge: input.maxAge,
        distanceKm: input.distanceKm,
        gender: input.gender ?? null,
      },
    });
  } else {
    await prisma.preference.create({
      data: {
        userId,
        minAge: input.minAge,
        maxAge: input.maxAge,
        distanceKm: input.distanceKm,
        gender: input.gender ?? null,
      },
    });
  }
}
