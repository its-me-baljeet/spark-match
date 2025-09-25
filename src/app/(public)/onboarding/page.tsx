"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { REGISTER_USER } from "@/utils/mutations";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  // local form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Pre-fill when Clerk user is available
  useEffect(() => {
    if (user) {
      setName(user.fullName || ""); // Clerk full name
      setBio(`Hi, I'm ${user.firstName || "new here"} 👋`); // playful default bio
      // you could also auto-add email or profile pic later
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const obj = {
      clerkId: user.id,
      name,
      age: age === "" ? null : Number(age),
      bio,
      gender,
      interests,
    };

    try {
      setLoading(true);
      setError(null);

      await gqlClient.request(REGISTER_USER, obj);

      // get intended route or fallback
      const redirectPath =
        sessionStorage.getItem("redirectAfterOnboarding") ||
        "/";

      sessionStorage.removeItem("redirectAfterOnboarding"); // clean up
      router.push(redirectPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while saving profile");
      }
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

        {/* Pre-filled with Clerk fullName */}
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        />

        {/* Optional pre-fill bio */}
        <textarea
          placeholder="Short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2"
        />

        {/* Email shown but disabled (read-only) */}
        {user?.primaryEmailAddress?.emailAddress && (
          <input
            type="text"
            value={user.primaryEmailAddress.emailAddress}
            disabled
            className="w-full border border-border rounded-md px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed"
          />
        )}

        {/* Age */}
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

        {/* Gender */}
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

        {/* Interests */}
        <input
          type="text"
          placeholder="Interests (comma separated)"
          value={interests.join(", ")}
          onChange={(e) =>
            setInterests(
              e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
          className="w-full border border-border rounded-md px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-2 rounded-md font-medium"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {error && <p className="text-red-500 text-sm">Error: {error}</p>}
      </form>
    </main>
  );
}
