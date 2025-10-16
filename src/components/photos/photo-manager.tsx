"use client";
import { useState } from "react";
import Image from "next/image";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { X, Camera, Upload, ArrowUp, ArrowDown } from "lucide-react";

interface PhotoManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

interface PhotoItem {
  url: string;
  order: number;
  isNew?: boolean;
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
    setPhotoItems(items);
    const urls = items
      .sort((a, b) => a.order - b.order)
      .map((item) => item.url);
    onChange(urls);
  };

  const removePhoto = (index: number) => {
    const newItems = photoItems.filter((_, i) => i !== index);
    // Reorder remaining photos
    const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
    updatePhotos(reorderedItems);
  };

  const movePhoto = (index: number, direction: "up" | "down") => {
    const newItems = [...photoItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap the items
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];

    // Update their order values
    newItems[index].order = index;
    newItems[targetIndex].order = targetIndex;

    updatePhotos(newItems);
  };

  const addPhoto = (url: string) => {
    if (photoItems.length >= maxPhotos) return;

    const newItem: PhotoItem = {
      url,
      order: photoItems.length,
      isNew: true,
    };

    updatePhotos([...photoItems, newItem]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Photos</h3>
          <p className="text-sm text-muted-foreground">
            {photoItems.length}/{maxPhotos} photos • Drag to reorder
          </p>
        </div>

        {photoItems.length < maxPhotos && (
          <CldUploadButton
            uploadPreset="default"
            onSuccess={(result) => {
              if (result?.info && typeof result.info !== "string") {
                const info = result.info as CloudinaryUploadWidgetInfo;
                addPhoto(info.secure_url);
              }
            }}
            options={{
              maxFiles: maxPhotos - photoItems.length,
              sources: ["local", "camera"],
              multiple: true,
            }}
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200">
              <Upload className="h-4 w-4" />
              Add Photos
            </span>
          </CldUploadButton>
        )}
      </div>

      {/* Photo Grid */}
      {photoItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photoItems.map((photo, index) => (
            <div
              key={`${photo.url}-${index}`}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-muted"
            >
              <Image
                src={photo.url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-200"
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {/* Move Up */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => movePhoto(index, "up")}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4 text-white" />
                    </button>
                  )}

                  {/* Move Down */}
                  {index < photoItems.length - 1 && (
                    <button
                      type="button"
                      onClick={() => movePhoto(index, "down")}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4 text-white" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                    title="Delete photo"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Photo Order Badge */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>

              {/* New Photo Badge */}
              {photo.isNew && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="border-2 border-dashed border-muted rounded-2xl p-12 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">
            No Photos Yet
          </h4>
          <p className="text-muted-foreground mb-6">
            Add some photos to make your profile stand out
          </p>
          <CldUploadButton
            uploadPreset="default"
            onSuccess={(result) => {
              if (result?.info && typeof result.info !== "string") {
                const info = result.info as CloudinaryUploadWidgetInfo;
                addPhoto(info.secure_url);
              }
            }}
            options={{
              maxFiles: maxPhotos,
              sources: ["local", "camera"],
              multiple: true,
            }}
          >
            <span className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200">
              <Upload className="h-5 w-5" />
              Upload Your First Photo
            </span>
          </CldUploadButton>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-pink-200/50 dark:border-pink-500/20">
        <h4 className="font-semibold text-foreground mb-2">Photo Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Your first photo will be your main profile picture</li>
          <li>• Use high-quality, well-lit photos for best results</li>
          <li>• Show your personality with a variety of shots</li>
          <li>• Avoid group photos where {"you're"} hard to identify</li>
        </ul>
      </div>
    </div>
  );
}
