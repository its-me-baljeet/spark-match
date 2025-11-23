"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ArrowUp, ArrowDown, Upload } from "lucide-react";

interface PhotoManagerProps {
  photos: string[]; // 🔹 string[] to match UserProfile
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

interface PhotoItem {
  url: string;
  order: number;
}

export default function PhotoManager({
  photos,
  onChange,
  maxPhotos = 6,
}: PhotoManagerProps) {
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>(
    photos.map((url, index) => ({ url, order: index }))
  );

  const updatePhotos = (items: PhotoItem[]) => {
    const sorted = items
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ ...item, order: index }));

    setPhotoItems(sorted);
    onChange(sorted.map((p) => p.url)); // 🔹 lift only URLs to parent
  };

  // 📍 Add photo using native file input + Cloudinary
  const addPhoto = async (file: File) => {
    if (!file || photoItems.length >= maxPhotos) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default");

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    ).then((res) => res.json());

    updatePhotos([
      ...photoItems,
      {
        url: upload.secure_url,
        order: photoItems.length,
      },
    ]);
  };

  const removePhoto = (index: number) =>
    updatePhotos(photoItems.filter((_, i) => i !== index));

  const movePhoto = (index: number, dir: "up" | "down") => {
    const newItems = [...photoItems];
    const targetIndex = dir === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];
    updatePhotos(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {photoItems.length}/{maxPhotos} photos
        </p>

        {photoItems.length < maxPhotos && (
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl">
            <Upload className="h-4 w-4" />
            Add Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addPhoto(file);
              }}
            />
          </label>
        )}
      </div>

      {photoItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {photoItems.map((photo, index) => (
            <div
              key={photo.url + index}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={`${photo.url}?v=${Date.now()}`} // cache-bust to see updates
                alt={`photo-${index}`}
                fill
                className="object-cover"
                unoptimized
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => movePhoto(index, "up")}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </button>
                )}
                {index < photoItems.length - 1 && (
                  <button
                    onClick={() => movePhoto(index, "down")}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <ArrowDown className="h-4 w-4 text-white" />
                  </button>
                )}
                <button
                  onClick={() => removePhoto(index)}
                  className="p-2 bg-red-500 rounded-full"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          No photos yet. Add your first!
        </p>
      )}
    </div>
  );
}
