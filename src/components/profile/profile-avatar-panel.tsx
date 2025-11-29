"use client";

import ProfileAvatar from "./profile-avatar";
import ProfileStats from "./profile-stats";
import ProfileMetadata from "./profile-metadata";
import type { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
  readonly?: boolean;
}

export default function ProfileAvatarPanel({
  profile,
  onProfileUpdate,
  readonly,
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <ProfileAvatar 
        profile={profile} 
        onProfileUpdate={onProfileUpdate} 
        readonly={readonly}
      />
      <ProfileStats profile={profile} readonly={readonly} />
      <div className="w-full pt-4 border-t border-border/50">
        <ProfileMetadata profile={profile} />
      </div>
    </div>
  );
}
