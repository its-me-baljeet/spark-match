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
    <section className="pt-6 border-t border-border/50 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
          <Heart className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Preferences
        </h2>
      </div>

      {/* Preference Chips */}
      <div className="flex flex-wrap gap-3">
        <PreferenceChip
          icon={<Users className="h-4 w-4" />}
          label={`Age ${preferences.minAge}–${preferences.maxAge}`}
          gradient="from-blue-500 to-cyan-500"
        />
        <PreferenceChip
          icon={<MapPin className="h-4 w-4" />}
          label={`Within ${preferences.distanceKm} km`}
          gradient="from-green-500 to-emerald-500"
        />
        <PreferenceChip
          icon={<Heart className="h-4 w-4" />}
          label={`Looking for ${genderLabel}`}
          gradient="from-pink-500 to-rose-500"
        />
      </div>
    </section>
  );
}

/* Preference Chip Component */
interface PreferenceChipProps {
  icon: React.ReactNode;
  label: string;
  gradient: string;
}

function PreferenceChip({ icon, label, gradient }: PreferenceChipProps) {
  return (
    <div
      className={`
        group
        relative
        inline-flex items-center gap-2
        px-4 py-2.5
        rounded-full
        bg-gradient-to-br ${gradient}
        text-white
        text-sm font-medium
        shadow-md
        transition-all duration-300
        hover:shadow-xl
        hover:scale-105
        cursor-default
      `}
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}
