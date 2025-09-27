"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import gqlClient from "@/services/graphql";
import { GET_CURRENT_USER } from "@/utils/queries";
import Image from "next/image";
import { UserProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import ProfileEditForm from "@/components/dialogs/edit-profile-dialog";

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
        const data: { getCurrentUser: UserProfile | null } =
          await gqlClient.request(GET_CURRENT_USER, { clerkId: user.id });
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

  if (loading)
    return (
      <p className="text-center mt-20 text-muted-foreground">Loading...</p>
    );
  if (error)
    return <p className="text-center mt-20 text-destructive">{error}</p>;
  if (!profile)
    return (
      <p className="text-center mt-20 text-muted-foreground">
        Profile not found.
      </p>
    );

  const mainPhoto = profile.photos?.[0];
  const age = Math.floor(
    (Date.now() - new Date(profile.birthday).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col items-center space-y-6">
      {/* Profile Photo */}
      {mainPhoto && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <Image
                src={mainPhoto}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
          </DialogTrigger>

          <DialogContent className="w-full max-w-3xl p-0 bg-background">
            <DialogHeader>
              <DialogTitle className="text-lg text-center">Photos</DialogTitle>
            </DialogHeader>

            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {profile.photos.map((p, i) => (
                <div
                  key={i}
                  className="relative w-full min-w-full h-96 snap-center"
                >
                  <Image
                    src={p}
                    alt={`photo-${i}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Basic Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center gap-5 justify-center">
          <h1 className="text-3xl font-bold">
            {profile.name}, {age}
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-fit bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
                <PencilIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <ProfileEditForm profile={profile} />
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">{profile.bio}</p>
      </div>

      {/* Preferences */}
      {profile.preferences && (
        <div className="flex flex-wrap justify-center gap-2">
          {profile.preferences.gender && (
            <Badge variant="secondary">{profile.preferences.gender}</Badge>
          )}
          <Badge variant="secondary">
            Age: {profile.preferences.minAge}-{profile.preferences.maxAge}
          </Badge>
          <Badge variant="secondary">
            Distance: {profile.preferences.distanceKm} km
          </Badge>
        </div>
      )}
    </main>
  );
}
