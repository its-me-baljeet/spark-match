// components/profile/ProfileAvatarSection.tsx
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfile } from "@/types";
import EditProfileFab from "./edit-profile-fab";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfileAvatarSection({
  profile,
  onProfileUpdate,
}: Props) {
  const mainPhoto = profile.photos?.[0];
  const age = Math.floor(
    (Date.now() - new Date(profile.birthday).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  // dumb completion score using fields you already have
  const completionPieces = [
    !!profile.bio,
    !!profile.photos?.length,
    !!profile.preferences,
    !!profile.location,
  ];
  const completion =
    (completionPieces.filter(Boolean).length / completionPieces.length) * 100;
  const completionLabel = `${Math.round(completion)}% COMPLETE`;

  return (
    <section className="px-5 pt-2 pb-8 relative">
      {/* Progress pill like Tinder "65% COMPLETE" */}
      <div className="flex justify-center mb-3">
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ff4458] to-[#ff7a5c] px-4 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
          {completionLabel}
        </span>
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Avatar with ring – tap to open photos viewer */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="relative h-32 w-32 rounded-full ring-[4px] ring-white dark:ring-neutral-900 shadow-[0_18px_40px_rgba(0,0,0,0.45)] overflow-hidden bg-muted"
            >
              {mainPhoto ? (
                <Image
                  src={mainPhoto}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                  No photo
                </div>
              )}
            </button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-5xl p-0 bg-black">
            <DialogHeader className="p-6 bg-gradient-to-b from-black/80 to-transparent">
              <DialogTitle className="text-xl text-center text-white">
                {profile.name}&apos;s Photos
              </DialogTitle>
            </DialogHeader>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {profile.photos.map((photo, i) => (
                <div
                  key={i}
                  className="relative w-full min-w-full h-96 md:h-[600px] snap-center"
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

        {/* Name + age under avatar */}
        <div className="mt-4 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            {profile.name}, {age}
          </h1>
        </div>

        {/* Floating Edit FAB like Tinder pencil button */}
        <EditProfileFab profile={profile} onProfileUpdate={onProfileUpdate} />
      </div>
    </section>
  );
}
