"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import gqlClient from "@/services/graphql";
import { GET_USER_BY_ID } from "@/utils/queries";
import { UserProfile } from "@/types";

import { Card } from "@/components/cards/card";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileHeader from "@/components/profile/profile-header";
import ProfilePreferences from "@/components/profile/profile-preferences";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await gqlClient.request<{ getUserById: UserProfile | null }>(
          GET_USER_BY_ID,
          { userId }
        );
        setProfile(data.getUserById);
      } catch {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Loading UI
  if (loading) {
    return (
      <div className="h-[calc(100vh-150px)] md:h-[calc(100vh-100px)] flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
        </Card>
      </div>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">User not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto md:pt-8">

        {/* Main Card */}
        <div className="
          bg-card/80 backdrop-blur-xl rounded-3xl 
          border border-border/50 shadow-lg overflow-hidden
        ">
          
          <div className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Avatar Section */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <ProfileAvatar profile={profile} readonly />
              </div>

              {/* Main Details */}
              <div className="flex-grow space-y-8 w-full">

                {/* Header (Name, Age, Bio) */}
                <ProfileHeader profile={profile} />

                {/* Divider */}
                <div className="h-px bg-border/50 w-full" />

                {/* Preferences Section */}
                <ProfilePreferences preferences={profile.preferences} />

                {/* Member Since */}
                <div className="pt-4 text-xs text-muted-foreground text-center md:text-left">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
