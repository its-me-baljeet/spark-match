"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { REGISTER_USER } from "@/utils/mutations";
import { useRouter } from "next/navigation";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { RegisterUserArgs, UserImageInput } from "@/types";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [images, setImages] = useState<UserImageInput[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill with Clerk info
  useEffect(() => {
    if (user) {
      setName(user.fullName ?? "");
      setBio(user.primaryEmailAddress?.emailAddress ?? "");
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
      age: age === "" ? 18 : Number(age),
      bio,
      gender,
      interests,
      images,
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
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value ? parseInt(e.target.value) : "")
          }
          min={18}
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
          onChange={(e) => setGender(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Interests (comma separated)"
          value={interests.join(", ")}
          onChange={(e) =>
            setInterests(
              e.target.value
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
            )
          }
          className="w-full border border-border rounded-md px-3 py-2"
        />

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

          {/* Image Previews */}
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
