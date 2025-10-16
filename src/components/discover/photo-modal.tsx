// components/discover/photo-modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { UserProfile } from "@/types";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PhotoModalProps {
  user: UserProfile | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  user,
  open,
  setOpen,
}) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setIndex(0);
  }, [user, open]);

  if (!user) return null;

  const photos = user.photos ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Photo of {user.name}</DialogTitle>
      <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden bg-card">
        <div className="relative w-full h-[70vh] sm:h-[72vh] bg-black flex items-center justify-center">
          <Image
            src={photos[index] ?? "/placeholder.jpg"}
            alt={`${user.name} photo ${index + 1}`}
            className="max-h-full object-contain"
            fill
            loading="lazy"
          />
          <button
            onClick={() =>
              setIndex((i) => (i - 1 + photos.length) % photos.length)
            }
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2"
          >
            ◀
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2"
          >
            ▶
          </button>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-black/30 p-2"
          >
            <X />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">
                {user.name}, {user.age}
              </h3>
              {user.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {index + 1} / {photos.length}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
