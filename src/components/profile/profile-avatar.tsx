"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserProfile } from "@/types";
import Image from "next/image";
import { useState } from "react";
import EditProfileFab from "./edit-profile-fab";

interface ProfileAvatarProps {
  profile: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
  readonly?: boolean;
  children?: (openAtIndex: (n: number) => void) => React.ReactNode; // 👈 Inject media rail here
}

export default function ProfileAvatar({
  profile,
  onProfileUpdate,
  readonly,
  children,
}: ProfileAvatarProps) {
  const [open, setOpen] = useState(false);

  const openAtIndex = (index: number) => {
    setOpen(true);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar Photo (opens dialog at index 0) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => openAtIndex(0)}
            className="
              relative aspect-square w-40 sm:w-48 md:w-56 lg:w-64
              rounded-full overflow-hidden ring-4 ring-primary/20
              shadow-lg cursor-pointer transition-all duration-500
              hover:ring-primary/40 hover:scale-105
            "
          >
            <Image
              src={profile.photos[0] ?? "/placeholder.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </button>
        </DialogTrigger>

        {/* Fullscreen viewer */}
        <DialogContent className="max-w-6xl p-0 bg-black/95 backdrop-blur-xl border-primary/20">
          <DialogHeader className="p-4 bg-gradient-to-b from-black/50 to-transparent">
            <DialogTitle className="text-white text-xl">
              {profile.name}&#39;s Photos
            </DialogTitle>
          </DialogHeader>

          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {profile.photos.map((photo, i) => (
              <div
                key={i}
                className="relative w-full min-w-full h-[80vh] snap-center"
              >
                <Image
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Inject photo rail — now gets the `openAtIndex` function */}
      {children?.(openAtIndex)}

      {/* Edit FAB */}
      {!readonly && onProfileUpdate && (
        <div className="absolute bottom-0.5 right-0.5 sm:bottom-2 sm:right-2 z-30">
          <EditProfileFab profile={profile} onProfileUpdate={onProfileUpdate} />
        </div>
      )}
    </div>
  );
}
