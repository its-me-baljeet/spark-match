"use client";
import { SectionHeader } from "../cards/card";
import { Settings } from "lucide-react";
import { RangeSlider } from "../sliders/range-slider";
import { SingleSlider } from "../sliders/single-slider";

export interface PreferencesForm {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface PreferencesSectionProps {
  preferences: PreferencesForm;
  onChange: (key: keyof PreferencesForm, value: PreferencesForm[keyof PreferencesForm]) => void;
}


export function PreferencesFormSection({ preferences, onChange }: PreferencesSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dating Preferences"
        icon={<Settings className="h-4 w-4" />}
        subtitle="Help us find your perfect matches"
      />

      <div className="p-5 rounded-2xl bg-muted">
        <RangeSlider
          min={18}
          max={80}
          values={[preferences.minAge, preferences.maxAge]}
          onChange={([minAge, maxAge]) => {
            onChange("minAge", minAge);
            onChange("maxAge", maxAge);
          }}
          label="Age Range"
        />
      </div>

      <div className="p-5 rounded-2xl bg-muted">
        <SingleSlider
          min={1}
          max={200}
          value={preferences.distanceKm}
          onChange={(value) => onChange("distanceKm", value)}
          label="Maximum Distance"
          unit="km"
        />
      </div>
    </div>
  );
}
