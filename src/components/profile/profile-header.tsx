"use client";

import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const age = Math.floor(
    (Date.now() - new Date(profile.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Name and Age */}
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent break-words">
        {profile.name}
        <span className="text-2xl sm:text-3xl text-muted-foreground font-normal ml-2">
          {age}
        </span>
      </h1>

      {/* Bio - Scrollable if too long */}
      {profile.bio && (
        <div className="max-h-32 overflow-y-auto scrollbar-thin pr-2">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose transition-colors hover:text-foreground/80 break-words">
            {profile.bio}
          </p>
        </div>
      )}
    </div>
  );
}
