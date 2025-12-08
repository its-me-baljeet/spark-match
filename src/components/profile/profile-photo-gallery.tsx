"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfilePhotoGalleryProps {
  photos: string[];
}

export default function ProfilePhotoGallery({
  photos,
}: ProfilePhotoGalleryProps) {
  if (photos.length <= 1) return null;

  const additionalPhotos = photos.slice(1);

  return (
    <section className="pt-6 border-t border-border/50 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
          <ImageIcon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Photos ({additionalPhotos.length})
        </h2>
      </div>

      {/* Horizontal Scrolling Photo Rail */}
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-2 px-2">
        {additionalPhotos.map((photo, idx) => (
          <Dialog key={idx}>
            <DialogTrigger asChild>
              <button
                className="
                  relative 
                  flex-shrink-0
                  w-32 h-40
                  sm:w-36 sm:h-48
                  rounded-2xl 
                  overflow-hidden 
                  bg-muted
                  group
                  cursor-pointer
                  transition-all duration-300
                  hover:scale-105
                  hover:shadow-xl
                  hover:ring-2 hover:ring-primary/50
                "
              >
                <Image
                  src={photo}
                  alt={`Photo ${idx + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </DialogTrigger>

            {/* Fullscreen Photo Viewer */}
            <DialogContent className="max-w-6xl p-0 bg-black/95 backdrop-blur-xl border-primary/20">
              <DialogHeader className="p-4 bg-gradient-to-b from-black/50 to-transparent">
                <DialogTitle className="text-white text-xl">
                  Photo {idx + 2}
                </DialogTitle>
              </DialogHeader>

              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {photos.map((p, i) => (
                  <div
                    key={i}
                    className="relative w-full min-w-full h-[80vh] snap-center"
                  >
                    <Image src={p} alt={`Photo ${i + 1}`} fill className="object-contain" />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
