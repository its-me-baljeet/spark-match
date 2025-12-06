"use client";
import gqlClient from "@/services/graphql";
import { useState } from "react";
import { UserProfile } from "@/types";
import { UPDATE_USER } from "@/utils/mutations";
import { Alert } from "../alerts/alert";
import { GradientButton } from "../sliders/gradient-button";
import PhotoManager from "../photos/photo-manager";
import { BasicInfoForm } from "../profile/basic-info-form";
import LocationPicker from "../location/location-picker";
import { PreferencesFormSection } from "../profile/preferences-form-section";


interface ProfileEditFormProps {
  profile: UserProfile;
  onUpdate?: (updatedProfile: UserProfile) => void;
  onClose?: () => void;
}

export default function ProfileEditForm({ profile, onUpdate, onClose }: ProfileEditFormProps) {
  const [form, setForm] = useState({
    name: profile.name,
    bio: profile.bio || "",
    gender: profile.gender,
    birthday: profile.birthday.split("T")[0],
    location: profile.location,
    photos: profile.photos || [],
    preferences: {
      minAge: profile.preferences?.minAge ?? 18,
      maxAge: profile.preferences?.maxAge ?? 50,
      distanceKm: profile.preferences?.distanceKm ?? 50,
      gender: profile.preferences?.gender,
    },
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {

    setForm(prev => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(false);
  };

  const updatePreferences = <
  K extends keyof typeof form.preferences
>(
  key: K,
  value: typeof form.preferences[K] | undefined
) => {
    if (value === undefined) return;
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const handleSave = async () => {
    if (!form.location.lat || !form.location.lng) {
      setError("Please provide your location");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const photoInputs =
        form.photos?.map((url, index) => ({
          url,
          order: index,
          publicId: `user-${profile.clerkId}-${index}`,
        })) ?? [];

      const response: { updateUser: UserProfile } = await gqlClient.request(
        UPDATE_USER,
        {
          input: {
            clerkId: profile.clerkId,
            name: form.name,
            bio: form.bio,
            gender: form.gender,
            birthday: form.birthday,
            location: form.location,
            photos: photoInputs,
            preferences: form.preferences,
          },
        }
      );

      onUpdate?.(response.updateUser);
      setSuccess(true);
      setTimeout(() => onClose?.(), 800);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Profile updated!</Alert>}

      {/* ⭐ Replaced hardcoded UI with reusable components */}
      <BasicInfoForm
        name={form.name}
        bio={form.bio}
        birthday={form.birthday}
        gender={form.gender}
        onChange={(key, value) => {
          if (key === 'name' || key === 'bio' || key === 'birthday' || key === 'gender') {
            updateField(key, value as typeof form[typeof key]);
          }
        }}
      />

      <PhotoManager
        photos={form.photos}
        onChange={(photos) => updateField("photos", photos)}
        maxPhotos={6}
      />

      <LocationPicker
        location={form.location}
        onChange={(loc) => updateField("location", loc)}
        onLocationFetch={() => {}}
      />

      <PreferencesFormSection
        preferences={form.preferences}
        onChange={updatePreferences}
      />

      <GradientButton
        onClick={handleSave}
        disabled={saving}
        loading={saving}
        className="w-full"
        size="lg"
      >
        {saving ? "Saving..." : "Save Changes"}
      </GradientButton>
    </div>
  );
}
