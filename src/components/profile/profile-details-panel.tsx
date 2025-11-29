"use client";

import type { UserProfile } from "@/types";
import ProfileHeader from "./profile-header";
import ProfilePhotoGallery from "./profile-photo-gallery";
import ProfilePreferences from "./profile-preferences";

export default function ProfileDetailsPanel({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
      <ProfileHeader profile={profile} />
      </div>
      {profile.photos.length > 1 && <ProfilePhotoGallery photos={profile.photos} />}
      {profile.preferences && <ProfilePreferences preferences={profile.preferences} />}
    </div>
  );
}
