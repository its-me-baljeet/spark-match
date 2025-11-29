import { Card, SectionHeader } from "@/components/cards/card";
import { Calendar, Heart, MapPin } from "lucide-react";
import { UserProfile } from "@/types";

export default function ProfileInfo({ profile }: { profile: UserProfile }) {
  return (
    <Card className="p-6">
      <SectionHeader title="About" icon={<Heart className="h-4 w-4" />} subtitle="Basic information" />
      <div className="mt-6 space-y-4 text-muted-foreground">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-pink-500" />
          <span>{profile.location?.lat && profile.location?.lng ? `${profile.location.lat.toFixed(2)}, ${profile.location.lng.toFixed(2)}` : "Location not set"}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-pink-500" />
          <span>Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </Card>
  );
}
