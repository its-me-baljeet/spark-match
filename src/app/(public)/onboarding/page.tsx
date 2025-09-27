"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { REGISTER_USER } from "@/utils/mutations";
import { useRouter } from "next/navigation";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { RegisterUserArgs, UserPhotoInput, UserPreferences } from "@/types";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(""); // ISO date string
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");

  const [preferences, setPreferences] = useState<UserPreferences>({
    minAge: 18,
    maxAge: 50,
    distanceKm: 10,
    gender: undefined,
  });
  const [images, setImages] = useState<UserPhotoInput[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const input: RegisterUserArgs = {
      clerkId: user.id,
      name,
      email,
      birthday: birthday || new Date().toISOString(), // fallback
      bio,
      gender,
      preferences,
      photos: images,
      location: { lat: 0, lng: 0 }, // temporary; replace with actual location if needed
    };

    try {
      setLoading(true);
      setError(null);
      await gqlClient.request(REGISTER_USER, { input });
      router.push("/"); // redirect after success
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong while saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-56px)] px-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-4 bg-card p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-semibold text-center">
          Complete Your Profile
        </h2>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        />
        <input
          type="date"
          placeholder="Birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        />
        <textarea
          placeholder="Short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        />
        <select
          value={gender}
          onChange={(e) =>
            setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")
          }
          className="w-full border border-border rounded-md px-3 py-2"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Preferences inputs */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Age"
            value={preferences.minAge}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                minAge: parseInt(e.target.value) || 18,
              })
            }
            className="w-1/3 border border-border rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max Age"
            value={preferences.maxAge}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                maxAge: parseInt(e.target.value) || 50,
              })
            }
            className="w-1/3 border border-border rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="Distance km"
            value={preferences.distanceKm}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                distanceKm: parseInt(e.target.value) || 10,
              })
            }
            className="w-1/3 border border-border rounded-md px-3 py-2"
          />
        </div>
        <select
          value={preferences.gender ?? "MALE"}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              gender: e.target.value as "MALE" | "FEMALE" | "OTHER",
            })
          }
          className="w-full border border-border rounded-md px-3 py-2"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Cloudinary Upload */}
        <div className="space-y-2">
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
            options={{ maxFiles: 5 }}
          >
            <div className="w-full border border-dashed border-rose-400 rounded-md p-3 text-center cursor-pointer text-sm text-rose-500">
              Upload Photos
            </div>
          </CldUploadButton>

          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-md overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={`preview-${i}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-2 rounded-md font-medium"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </main>
  );
}
