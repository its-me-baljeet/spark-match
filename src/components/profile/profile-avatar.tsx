"use client";

import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProfileFab from "./edit-profile-fab";
import type { UserProfile } from "@/types";

interface ProfileAvatarProps {
  profile: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
  readonly?: boolean;
}

export default function ProfileAvatar({
  profile,
  onProfileUpdate,
  readonly,
}: ProfileAvatarProps) {
  const mainPhoto = profile.photos?.[0];

  return (
    <div className="relative flex justify-center items-center group">
      {/* Avatar Photo Viewer */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="
              relative
              aspect-square
              w-40 sm:w-48 md:w-56 lg:w-64
              rounded-full
              overflow-hidden
              ring-4 ring-primary/20
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
              dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              cursor-pointer
              transition-all duration-500
              hover:ring-primary/40
              hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)]
              dark:hover:shadow-[0_15px_50px_rgba(0,0,0,0.7)]
              hover:scale-105
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:to-primary/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
            "
          >
            <Image
              src={mainPhoto ?? "/placeholder.png"}
              alt="Profile"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </button>
        </DialogTrigger>

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

      {/* Edit Profile Button */}
      {!readonly && onProfileUpdate && (
        <div
          className="
            absolute
            -bottom-2 -right-2
            sm:-bottom-3 sm:-right-3
            z-20
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
          onClick={(e) => e.stopPropagation()}
        >
          <EditProfileFab
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      )}
    </div>
  );
}
