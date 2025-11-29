"use client";

import { Card } from "@/components/cards/card";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditProfileButton from "./edit-profile-button";
import { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export default function ProfileHero({ profile, setProfile }: Props) {
  const mainPhoto = profile.photos?.[0];
  const age = Math.floor((Date.now() - new Date(profile.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <Card gradient className="overflow-hidden relative">
      {mainPhoto ? (
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-60 md:h-[500px] cursor-pointer group">
              <Image src={mainPhoto} alt="Profile" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </DialogTrigger>

          <DialogContent className="w-full max-w-6xl p-0 bg-black">
            <DialogHeader className="p-6 bg-gradient-to-b from-black/80 to-transparent">
              <DialogTitle className="text-xl text-center text-white">{profile.name} Photos</DialogTitle>
            </DialogHeader>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {profile.photos.map((photo, i) => (
                <div key={i} className="relative w-full min-w-full h-96 md:h-[600px] snap-center">
                  <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="h-60 md:h-[500px] bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/20 dark:to-orange-900/20 flex items-center justify-center">
          No photos uploaded
        </div>
      )}

      <EditProfileButton profile={profile} setProfile={setProfile} />
      <div className="absolute bottom-6 left-6 z-10 text-white">
        <h1 className="text-4xl font-bold">{profile.name}, {age}</h1>
        {profile.bio && <p className="text-white/80 text-lg max-w-xl">{profile.bio}</p>}
      </div>
    </Card>
  );
}
