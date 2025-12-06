"use client";

import type { UserProfile } from "@/types";
import { Calendar, MapPin } from "lucide-react";

interface ProfileMetadataProps {
  profile: UserProfile;
}

export default function ProfileMetadata({ profile }: ProfileMetadataProps) {

  console.log("Profile Metadata City:", profile.city);

  const joined = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3 animate-fade-in">
      <MetadataItem
        icon={<MapPin className="h-5 w-5" />}
        label={profile.city || "Unknown Location"}
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
