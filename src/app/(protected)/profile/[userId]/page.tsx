"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import gqlClient from "@/services/graphql";
import { GET_USER_BY_ID } from "@/utils/queries";
import { UserProfile } from "@/types";

import { LoadingSpinner } from "@/components/loader/loading-spinner";
import { Card } from "@/components/cards/card";
import { GradientButton } from "@/components/sliders/gradient-button";

import ProfileAvatarPanel from "@/components/profile/profile-avatar-panel";
import ProfileDetailsPanel from "@/components/profile/profile-details-panel";

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
        const data = await gqlClient.request<{
          getUserById: UserProfile | null;
        }>(GET_USER_BY_ID, { userId });
        setProfile(data.getUserById);
      } catch {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <GradientButton onClick={() => window.location.reload()}>
            Try Again
          </GradientButton>
        </Card>
      </div>
    );
  }

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
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-background via-background to-primary/5 px-3 sm:px-4 lg:px-6 py-4 flex items-center justify-center">
      <div
        className="
          w-full
          max-w-[95vw]
          min-h-[85vh]
          max-h-[92vh]
          flex flex-col lg:flex-row gap-6 lg:gap-10
          bg-card/80 backdrop-blur-xl
          rounded-3xl 
          shadow-[0_10px_40px_rgba(0,0,0,0.15)]
          dark:shadow-[0_10px_40px_rgba(255,255,255,0.05),0_0_60px_rgba(var(--primary-rgb),0.15)]
          border border-border/50
          p-8 sm:p-10 lg:p-12
          transition-all duration-500
          hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)]
          dark:hover:shadow-[0_15px_50px_rgba(255,255,255,0.08),0_0_80px_rgba(var(--primary-rgb),0.2)]
          overflow-hidden
        "
      >
        {/* Left Panel - Avatar, Stats (Hidden), and Metadata */}
        <div className="flex-shrink-0 w-full lg:w-1/3 max-w-sm mx-auto lg:mx-0 flex flex-col justify-center overflow-y-auto scrollbar-thin">
          <ProfileAvatarPanel profile={profile} readonly={true} />
        </div>

        {/* Right Panel - Details (Header, Photos, Preferences) */}
        <div className="flex-grow min-w-0 flex flex-col justify-center overflow-y-auto scrollbar-thin">
          <ProfileDetailsPanel profile={profile} />
        </div>
      </div>
    </main>
  );
}
