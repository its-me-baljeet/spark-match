"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import type { UserProfile } from "@/types";
import { getCityFromCoords } from "@/utils/get-city-from-coords";

interface ProfileMetadataProps {
  profile: UserProfile;
}

export default function ProfileMetadata({ profile }: ProfileMetadataProps) {
  const [cityName, setCityName] = useState<string>("Loading...");

  const joined = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (profile.location?.lat) {
      getCityFromCoords(profile.location.lat, profile.location.lng).then(setCityName);
    } else {
      setCityName("Location not set");
    }
  }, [profile.location]);

  return (
    <div className="space-y-3 animate-fade-in">
      <MetadataItem
        icon={<MapPin className="h-5 w-5" />}
        label={cityName}
        gradient="from-blue-500 to-cyan-500"
      />
      <MetadataItem
        icon={<Calendar className="h-5 w-5" />}
        label={`Joined ${joined}`}
        gradient="from-purple-500 to-pink-500"
      />
    </div>
  );
}

/* Reusable Metadata Item */
interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  gradient: string;
}

function MetadataItem({ icon, label, gradient }: MetadataItemProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground group cursor-default transition-all duration-300 hover:text-foreground p-2 rounded-lg hover:bg-muted/30">
      <div
        className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${gradient} text-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}
