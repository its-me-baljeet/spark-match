// components/profile/ProfileDetailsSection.tsx
"use client";

import { Calendar, MapPin } from "lucide-react";
import { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
}

export default function ProfileDetailsSection({ profile }: Props) {
  const joined = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="px-5 pt-10 pb-4 border-t border-border/50">
      {profile.bio && (
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#ff4458]" />
          <span>
            {profile.location?.lat && profile.location?.lng
              ? `${profile.location.lat.toFixed(
                  2
                )}, ${profile.location.lng.toFixed(2)}`
              : "Location not set"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#ff4458]" />
          <span>Joined {joined}</span>
        </div>
      </div>
    </section>
  );
}
