"use client";

import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

import { User } from "lucide-react";

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const age = Math.floor(
    (Date.now() - new Date(profile.birthday).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Name and Age Header */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground flex items-center gap-3">
          {profile.name}
          <span className="text-3xl sm:text-4xl text-muted-foreground font-normal">
            {age}
          </span>
        </h1>
      </div>

      {/* About Me Section */}
      {profile.bio && (
        <section className="space-y-4">
          {/* <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 ring-1 ring-blue-500/30">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              About Me
            </h2>
          </div> */}

          <div className="relative pl-4 border-l-2 border-border/50">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line break-words">
              {profile.bio}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
