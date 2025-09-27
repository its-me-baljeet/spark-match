"use client";

import { useState } from "react";
import gqlClient from "@/services/graphql";
import { UPDATE_USER } from "@/utils/mutations";
import { UserProfile } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PreferencesForm {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export default function ProfileEditForm({ profile }: { profile: UserProfile }) {
  const [form, setForm] = useState({
    name: profile.name,
    bio: profile.bio || "",
    gender: profile.gender,
    birthday: profile.birthday.split('T')[0], // Convert ISO string to date input format
    location: profile.location,
    photos: profile.photos || [],
    preferences: {
      minAge: profile.preferences?.minAge || 18,
      maxAge: profile.preferences?.maxAge || 50,
      distanceKm: profile.preferences?.distanceKm || 50,
      gender: profile.preferences?.gender,
    } as PreferencesForm,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreferencesChange = <K extends keyof PreferencesForm>(
    key: K,
    value: PreferencesForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await gqlClient.request(UPDATE_USER, {
        input: {
          clerkId: profile.clerkId,
          name: form.name,
          bio: form.bio,
          gender: form.gender,
          birthday: form.birthday,
          location: form.location,
          photos: form.photos.map((url, index) => ({
            url,
            order: index,
            publicId: `user-${profile.clerkId}-${index}`, // Generate a publicId
          })),
          preferences: {
            minAge: form.preferences.minAge,
            maxAge: form.preferences.maxAge,
            distanceKm: form.preferences.distanceKm,
            gender: form.preferences.gender,
          },
        },
      });
      
      // TODO: Show success message or trigger refresh/close dialog
      console.log("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <Input
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
        required
      />
      
      <textarea
        value={form.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
        placeholder="Bio"
        className="w-full border border-border rounded-md px-3 py-2 min-h-[100px]"
      />
      
      <select
        value={form.gender}
        onChange={(e) => handleChange("gender", e.target.value as "MALE" | "FEMALE" | "OTHER")}
        className="w-full border border-border rounded-md px-3 py-2"
        required
      >
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
      
      <Input
        value={form.birthday}
        type="date"
        onChange={(e) => handleChange("birthday", e.target.value)}
        placeholder="Birthday"
        required
      />

      {/* Preferences */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Dating Preferences</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={form.preferences.minAge}
            onChange={(e) => handlePreferencesChange("minAge", parseInt(e.target.value) || 18)}
            placeholder="Min Age"
            min="18"
            max="100"
          />
          <Input
            type="number"
            value={form.preferences.maxAge}
            onChange={(e) => handlePreferencesChange("maxAge", parseInt(e.target.value) || 50)}
            placeholder="Max Age"
            min="18"
            max="100"
          />
          <Input
            type="number"
            value={form.preferences.distanceKm}
            onChange={(e) => handlePreferencesChange("distanceKm", parseInt(e.target.value) || 50)}
            placeholder="Max Distance (km)"
            min="1"
            max="500"
          />
          <select
            value={form.preferences.gender || ""}
            onChange={(e) =>
              handlePreferencesChange(
                "gender",
                e.target.value ? (e.target.value as "MALE" | "FEMALE" | "OTHER") : undefined
              )
            }
            className="w-full border border-border rounded-md px-3 py-2"
          >
            <option value="">Any Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}