"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { REGISTER_USER } from "@/utils/mutations";
import { useRouter } from "next/navigation";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { RegisterUserArgs, UserPhotoInput, UserPreferences } from "@/types";
import {
  MapPin,
  Loader2,
  X,
  Heart,
  Camera,
  User,
  Settings,
} from "lucide-react";

// Custom Range Slider Component
function RangeSlider({
  min,
  max,
  values,
  onChange,
  label,
}: {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  label: string;
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= values[1]) {
      onChange([newMin, values[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= values[0]) {
      onChange([values[0], newMax]);
    }
  };

  const minPercent = ((values[0] - min) / (max - min)) * 100;
  const maxPercent = ((values[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {label}: {values[0]} - {values[1]} years
      </label>
      <div className="relative px-3">
        <div className="relative h-2 bg-muted rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={values[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb top-0"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={values[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb top-0"
        />
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
        .slider-thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </div>
  );
}

// Single Slider Component
function SingleSlider({
  min,
  max,
  value,
  onChange,
  label,
  unit,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  unit: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {label}: {value} {unit}
      </label>
      <div className="relative px-3">
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb top-0"
        />
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
        .slider-thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </div>
  );
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [locationName, setLocationName] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    minAge: 18,
    maxAge: 50,
    distanceKm: 50,
    gender: undefined,
  });
  const [images, setImages] = useState<UserPhotoInput[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (user) {
      setName(user.fullName ?? "");
      setEmail(user.primaryEmailAddress?.emailAddress ?? "");
      if (user.imageUrl) {
        setImages([
          { url: user.imageUrl, publicId: "clerk-profile", order: 0 },
        ]);
      }
    }
  }, [user]);

  // Auto-fetch location when component mounts
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setManualLocation(true);
      return;
    }

    setFetchingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Reverse geocode to get city name
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          setLocationName(
            data.city ||
              data.locality ||
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          );
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }

        setFetchingLocation(false);
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError("Unable to fetch location. Please enter manually.");
        setManualLocation(true);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!location.lat || !location.lng) {
      setError("Please provide your location to continue.");
      return;
    }

    const input: RegisterUserArgs = {
      clerkId: user.id,
      name,
      email,
      birthday: birthday || new Date().toISOString(),
      bio,
      gender,
      preferences,
      photos: images,
      location,
    };

    try {
      setLoading(true);
      setError(null);
      await gqlClient.request(REGISTER_USER, { input });

      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterOnboarding");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterOnboarding");
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong while saving profile");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return name && birthday && gender;
      case 2:
        return location.lat && location.lng;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return User;
      case 2:
        return Camera;
      case 3:
        return Settings;
      default:
        return User;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-background dark:via-card/50 dark:to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50">
        {/* Progress Bar */}
        <div className="bg-muted/30 h-2">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep} of 3 •{" "}
              {currentStep === 1
                ? "About You"
                : currentStep === 2
                ? "Photos & Location"
                : "Preferences"}
            </p>
          </div>

          {/* Step Icons */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => {
                const Icon = getStepIcon(step);
                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        step <= currentStep
                          ? "bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 border-transparent text-white shadow-lg"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                          step < currentStep
                            ? "bg-gradient-to-r from-pink-500 to-orange-500"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Birthday
                    </label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      About You
                    </label>
                    <textarea
                      placeholder="Tell others about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-4 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-2">
                      {bio.length}/500
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["MALE", "FEMALE", "OTHER"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setGender(option)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                            gender === option
                              ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {option.charAt(0) + option.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-pink-500" />
                    Your Location
                  </h3>

                  {!manualLocation && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={fetchCurrentLocation}
                        disabled={fetchingLocation}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                      >
                        {fetchingLocation ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Getting location...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            Use Current Location
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualLocation(true)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        Enter manually
                      </button>
                    </div>
                  )}

                  {locationError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <p className="text-destructive text-sm">
                        {locationError}
                      </p>
                    </div>
                  )}

                  {locationName && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-green-800 dark:text-green-400 font-medium">
                          Location found
                        </p>
                        <p className="text-green-700 dark:text-green-500 text-sm">
                          {locationName}
                        </p>
                      </div>
                    </div>
                  )}

                  {manualLocation && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={location.lat}
                          onChange={(e) =>
                            setLocation((prev) => ({
                              ...prev,
                              lat: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-background border border-border rounded-xl px-3 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
                          placeholder="0.0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={location.lng}
                          onChange={(e) =>
                            setLocation((prev) => ({
                              ...prev,
                              lng: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-background border border-border rounded-xl px-3 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-foreground"
                          placeholder="0.0000"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Photos Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-5 h-5 text-pink-500" />
                    Add Photos
                  </h3>

                  <CldUploadButton
                    uploadPreset="default"
                    onSuccess={(result) => {
                      if (result?.info && typeof result.info !== "string") {
                        const info = result.info as CloudinaryUploadWidgetInfo;
                        setImages((prev) => [
                          ...prev,
                          {
                            url: info.secure_url,
                            publicId: info.public_id,
                            order: prev.length,
                          },
                        ]);
                      }
                    }}
                    options={{ maxFiles: 6 }}
                  >
                    <div className="w-full border-2 border-dashed border-pink-300 dark:border-pink-500/30 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 dark:hover:border-pink-500/50 hover:bg-pink-50/50 dark:hover:bg-pink-500/5 transition-all duration-200">
                      <Camera className="mx-auto h-12 w-12 text-pink-500 mb-3" />
                      <p className="text-pink-600 dark:text-pink-400 font-semibold text-lg">
                        Upload Photos
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        Add up to 6 photos • JPG, PNG
                      </p>
                    </div>
                  </CldUploadButton>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-2xl overflow-hidden group bg-muted"
                        >
                          <Image
                            src={img.url}
                            alt={`Photo ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-pink-500" />
                    Dating Preferences
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Help us find your perfect matches
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-500/5 dark:to-orange-500/5 rounded-2xl border border-pink-200/50 dark:border-pink-500/10">
                    <RangeSlider
                      min={18}
                      max={80}
                      values={[preferences.minAge, preferences.maxAge]}
                      onChange={([minAge, maxAge]) => {
                        setPreferences((prev) => ({ ...prev, minAge, maxAge }));
                      }}
                      label="Age Range"
                    />
                  </div>

                  <div className="p-5 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-500/5 dark:to-pink-500/5 rounded-2xl border border-red-200/50 dark:border-red-500/10">
                    <SingleSlider
                      min={1}
                      max={200}
                      value={preferences.distanceKm}
                      onChange={(distanceKm) =>
                        setPreferences((prev) => ({ ...prev, distanceKm }))
                      }
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
                        { value: "", label: "Any" },
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                        { value: "OTHER", label: "Other" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setPreferences((prev) => ({
                              ...prev,
                              gender: option.value
                                ? (option.value as "MALE" | "FEMALE" | "OTHER")
                                : undefined,
                            }))
                          }
                          className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                            (preferences.gender || "") === option.value
                              ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors font-medium"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className={`ml-auto px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    canProceedToNextStep()
                      ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transform hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Complete Profile
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
