// utils/photoService.ts
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface PhotoInput {
  id?: string;
  url: string;
  publicId: string;
  order?: number;
}

export async function syncPhotos(
  userId: string,
  existingPhotos: { id: string; publicId: string }[],
  submitted: PhotoInput[]
) {
  const submittedIds = new Set(submitted.filter((p) => p.id).map((p) => p.id));
  const toDelete = existingPhotos.filter((p) => !submittedIds.has(p.id));
  const toUpdate = submitted.filter((p) => p.id);
  const toCreate = submitted.filter((p) => !p.id);

  // 1. Delete photos
  await Promise.all(
    toDelete.map(async (p) => {
      try {
        // delete from cloudinary (optional if you’re using it)
        // await cloudinary.uploader.destroy(p.publicId);
        await prisma.photo.delete({ where: { id: p.id } });
      } catch (err) {
        console.error("Failed to delete photo:", p.id, err);
      }
    })
  );

  // 2. Update photos
  // 2. Update photos
  await Promise.all(
    toUpdate.map(async (p) => {
      await prisma.photo.update({
        where: { id: p.id! },
        data: {
          url: p.url,
          publicId: p.publicId,
          order: p.order ?? 0,
        },
      });
    })
  );

  // 3. Create photos
  await Promise.all(
    toCreate.map(async (p) => {
      await prisma.photo.create({
        data: { userId, url: p.url, publicId: p.publicId, order: p.order ?? 0 },
      });
    })
  );
}
