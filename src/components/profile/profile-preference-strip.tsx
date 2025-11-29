// components/profile/ProfilePreferencesStrip.tsx
"use client";

import { UserProfile } from "@/types";

type Preferences = NonNullable<UserProfile["preferences"]>;

interface Props {
  preferences: Preferences;
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {label}
    </span>
  );
}

export default function ProfilePreferencesStrip({ preferences }: Props) {
  const genderLabel = preferences.gender
    ? preferences.gender.charAt(0) + preferences.gender.slice(1).toLowerCase()
    : "Anyone";

  return (
    <section className="px-5 py-4 border-t border-border/50 bg-muted/30">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Preferences
      </h2>
      <div className="flex flex-wrap gap-2">
        <Chip label={`Age ${preferences.minAge}–${preferences.maxAge}`} />
        <Chip label={`Within ${preferences.distanceKm} km`} />
        <Chip label={`Looking for ${genderLabel}`} />
      </div>
    </section>
  );
}
