"use client";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

export default function ImageUpload() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <CldUploadButton
        uploadPreset={"default"}
        onSuccess={(result) => {
          if (!result.info) return; // ✅ guard against undefined

          // info is either a string or CloudinaryUploadWidgetInfo
          const info = result.info;
          const url = typeof info === "string" ? info : info.secure_url; // get secure_url if object

          if (url) {
            setImages((prev) => [...prev, url]);
          }
        }}
        options={{ maxFiles: 5 }}
      >
        <div className="w-full border border-dashed border-rose-400 rounded-md p-3 text-center cursor-pointer text-sm text-rose-500">
          Upload Photos
        </div>
      </CldUploadButton>

      <div className="flex gap-2 overflow-x-auto mt-2">
        {images.map((url, i) => (
          <Image
            key={i}
            src={url}
            alt={`preview-${i}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  );
}
