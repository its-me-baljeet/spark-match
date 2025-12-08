"use client";

import { Heart, MapPin, Users } from "lucide-react";
import type { UserProfile } from "@/types";

type Preferences = NonNullable<UserProfile["preferences"]>;

interface ProfilePreferencesProps {
  preferences: Preferences;
}

export default function ProfilePreferences({ preferences }: ProfilePreferencesProps) {
  const genderLabel = preferences.gender
    ? preferences.gender.charAt(0) + preferences.gender.slice(1).toLowerCase()
    : "Anyone";

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
         <div className="h-6 w-1 rounded-full bg-primary" />
         <h2 className="text-lg font-semibold tracking-tight">Preferences</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PreferenceItem
          icon={<Users className="h-4 w-4" />}
          label="Age Range"
          value={`${preferences.minAge} – ${preferences.maxAge}`}
        />
        <PreferenceItem
          icon={<MapPin className="h-4 w-4" />}
          label="Distance"
          value={`Up to ${preferences.distanceKm} km`}
        />
        <PreferenceItem
          icon={<Heart className="h-4 w-4" />}
          label="Interested In"
          value={genderLabel}
        />
      </div>
    </section>
  );
}

interface PreferenceItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function PreferenceItem({ icon, label, value }: PreferenceItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 transition-colors hover:bg-secondary/50">
      <div className="p-2 rounded-lg bg-background shadow-sm text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
