"use client";
import gqlClient from "@/services/graphql";
import { UserProfile } from "@/types";
import { UPDATE_USER } from "@/utils/mutations";
import { Camera, MapPin, Settings, User } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "../sliders/gradient-button";
import { Alert } from "../alerts/alert";
import { SectionHeader } from "../cards/card";
import PhotoManager from "../photos/photo-manager";
import { RangeSlider } from "../sliders/range-slider";
import { SingleSlider } from "../sliders/single-slider";

interface PreferencesForm {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

interface ProfileEditFormProps {
  profile: UserProfile;
  onUpdate?: (updatedProfile: UserProfile) => void;
  onClose?: () => void;
}

// Location Picker Component
function LocationPicker({ location, onChange, onLocationFetch }: {
  location: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
  onLocationFetch: () => void;
}) {
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState(false);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setManualLocation(true);
      return;
    }

    setFetchingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange({ lat: latitude, lng: longitude });
        setFetchingLocation(false);
        onLocationFetch();
      },
      (error) => {
        console.error(error);
        setLocationError("Unable to fetch location. Please enter manually.");
        setManualLocation(true);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-4">
      {!manualLocation && (
        <div className="flex items-center gap-3">
          <GradientButton
            variant="secondary"
            size="sm"
            onClick={fetchCurrentLocation}
            disabled={fetchingLocation}
            loading={fetchingLocation}
          >
            <MapPin className="h-4 w-4" />
            {fetchingLocation ? "Getting location..." : "Use Current Location"}
          </GradientButton>
          <button
            type="button"
            onClick={() => setManualLocation(true)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Enter manually
          </button>
        </div>
      )}

      {locationError && <Alert type="error">{locationError}</Alert>}

      {(manualLocation || (location.lat && location.lng)) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={location.lat}
              onChange={(e) => onChange({ ...location, lat: parseFloat(e.target.value) || 0 })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
              placeholder="0.0000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={location.lng}
              onChange={(e) => onChange({ ...location, lng: parseFloat(e.target.value) || 0 })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
              placeholder="0.0000"
            />
          </div>
        </div>
      )}
    </div>
  );
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
      minAge: profile.preferences?.minAge || 18,
      maxAge: profile.preferences?.maxAge || 50,
      distanceKm: profile.preferences?.distanceKm || 50,
      gender: profile.preferences?.gender,
    } as PreferencesForm,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(false);
  };

  const handlePreferencesChange = <K extends keyof PreferencesForm>(key: K, value: PreferencesForm[K]) => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
    setError(null);
  };

  const handleSave = async () => {
    if (!form.location.lat || !form.location.lng) {
      setError("Please provide your location to continue.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Optimistic update
      const optimisticProfile: UserProfile = {
        ...profile,
        name: form.name,
        bio: form.bio,
        gender: form.gender,
        birthday: form.birthday,
        location: form.location,
        preferences: form.preferences,
      };

      onUpdate?.(optimisticProfile);

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
            photos: form.photos.map((url, index) => ({
              url,
              order: index,
              publicId: `user-${profile.clerkId}-${index}`,
            })),
            preferences: {
              minAge: form.preferences.minAge,
              maxAge: form.preferences.maxAge,
              distanceKm: form.preferences.distanceKm,
              gender: form.preferences.gender,
            },
          },
        }
      );

      // Update with actual response
      onUpdate?.(response.updateUser);
      setSuccess(true);

      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      // Revert optimistic update on error
      onUpdate?.(profile);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Profile updated successfully!</Alert>}

      {/* Basic Information */}
      <div className="space-y-6">
        <SectionHeader
          title="Basic Information" 
          icon={<User className="h-4 w-4" />}
          subtitle="Update your personal details"
        />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              About You
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right mt-2">{form.bio.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChange("gender", option)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    form.gender === option
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Birthday
            </label>
            <input
              value={form.birthday}
              type="date"
              onChange={(e) => handleChange("birthday", e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
              required
            />
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="space-y-6">
        <SectionHeader 
          title="Photos" 
          icon={<Camera className="h-4 w-4" />}
          subtitle="Manage your profile photos"
        />
        
        <PhotoManager
          photos={form.photos}
          onChange={(photos) => handleChange("photos", photos)}
          maxPhotos={6}
        />
      </div>

      {/* Location */}
      <div className="space-y-6">
        <SectionHeader 
          title="Location" 
          icon={<MapPin className="h-4 w-4" />}
          subtitle="Update your location for better matches"
        />
        
        <LocationPicker
          location={form.location}
          onChange={(location) => handleChange("location", location)}
          onLocationFetch={() => {}}
        />
      </div>

      {/* Dating Preferences */}
      <div className="space-y-6">
        <SectionHeader 
          title="Dating Preferences" 
          icon={<Settings className="h-4 w-4" />}
          subtitle="Help us find your perfect matches"
        />
        
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-500/5 dark:to-orange-500/5 rounded-2xl border border-pink-200/50 dark:border-pink-500/10">
            <RangeSlider
              min={18}
              max={80}
              values={[form.preferences.minAge, form.preferences.maxAge]}
              onChange={([minAge, maxAge]) => {
                handlePreferencesChange("minAge", minAge);
                handlePreferencesChange("maxAge", maxAge);
              }}
              label="Age Range"
            />
          </div>

          <div className="p-5 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-500/5 dark:to-pink-500/5 rounded-2xl border border-red-200/50 dark:border-red-500/10">
            <SingleSlider
              min={1}
              max={200}
              value={form.preferences.distanceKm}
              onChange={(value) => handlePreferencesChange("distanceKm", value)}
              label="Maximum Distance"
              unit="km"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Preferred Gender
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '', label: 'Any' },
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePreferencesChange("gender", 
                    option.value ? (option.value as "MALE" | "FEMALE" | "OTHER") : undefined
                  )}
                  className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                    (form.preferences.gender || '') === option.value
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-border">
        <GradientButton
          onClick={handleSave}
          disabled={saving}
          loading={saving}
          className="w-full"
          size="lg"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </GradientButton>
      </div>
    </div>
  );
}