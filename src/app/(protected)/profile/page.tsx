"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { GET_CURRENT_USER } from "@/utils/queries";
import Image from "next/image";
import { UserProfile } from "@/types";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data: {
          getCurrentUser: UserProfile | null;
        } = await gqlClient.request(GET_CURRENT_USER, { clerkId: user.id });
        setProfile(data.getCurrentUser);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!profile) return <p className="text-center mt-20">Profile not found.</p>;
  console.log(profile.images);

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      {/* Images Carousel */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {profile.images?.map((img: string, i: number) => (
          <div
            key={i}
            className="relative w-40 h-40 rounded-md overflow-hidden flex-shrink-0"
          >
            <Image
              src={img}
              alt={`profile-${i}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Basic Info */}
      <h1 className="text-3xl font-bold mb-2">
        {profile.name}, {profile.age}
      </h1>
      <p className="text-muted-foreground mb-4">{profile.bio}</p>

      {/* Interests */}
      <div className="flex flex-wrap gap-2 mb-6">
        {profile.interests.map((interest: string, i: number) => (
          <span
            key={i}
            className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Edit Button */}
      <button className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-2 rounded-md font-medium">
        Edit Profile
      </button>
    </main>
  );
}
