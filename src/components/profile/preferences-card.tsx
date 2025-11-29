import { Card, SectionHeader } from "@/components/cards/card";
import { Heart } from "lucide-react";
import { UserPreferences } from "@/types";

export default function PreferencesCard({ preferences }: { preferences: UserPreferences }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-900/10 dark:to-orange-900/10">
      <SectionHeader title="Dating Preferences" icon={<Heart className="h-4 w-4" />} />
      <div className="mt-6 space-y-4">
        {[
          { label: "Age Range", value: `${preferences.minAge} – ${preferences.maxAge} years` },
          { label: "Max Distance", value: `${preferences.distanceKm} km` },
          { label: "Looking For", value: preferences.gender ? preferences.gender.charAt(0) + preferences.gender.slice(1).toLowerCase() : "Anyone" },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 bg-card rounded-xl border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
