"use client";
import { SectionHeader } from "../cards/card";
import { Settings } from "lucide-react";
import { RangeSlider } from "../sliders/range-slider";
import { SingleSlider } from "../sliders/single-slider";

export interface PreferencesForm {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender: "MALE" | "FEMALE" | "OTHER";
}

export interface PreferencesSectionProps {
  preferences: PreferencesForm;
  onChange: <K extends keyof PreferencesForm>(
    key: K,
    value: PreferencesForm[K]
  ) => void;
  saving?: boolean;
}

export function PreferencesFormSection({
  preferences,
  onChange,
  saving
}: PreferencesSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dating Preferences"
        icon={<Settings className="h-4 w-4" />}
        subtitle="Help us find your perfect matches"
      />

      {/* Age Range */}
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
          saving={saving}
        />
      </div>

      {/* Maximum Distance */}
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

      {/* Preferred Gender */}
      <div className="p-5 rounded-2xl bg-muted space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Preferred Gender
        </label>

        <div className="grid grid-cols-3 gap-3">
          {(["MALE", "FEMALE", "OTHER"] as const).map((option) => (
            <button
              key={option}
              type="button"
              disabled={saving}
              onClick={() => !saving && onChange("gender", option)}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                preferences.gender === option
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg"
                  : "bg-background text-muted-foreground hover:bg-muted"
              } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {option.charAt(0) + option.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
