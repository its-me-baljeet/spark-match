"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import gqlClient from "@/services/graphql";
import { GET_CURRENT_USER } from "@/utils/queries";
import { UserProfile } from "@/types";
import Image from "next/image";

import { LoadingSpinner } from "@/components/loader/loading-spinner";
import { Card } from "@/components/cards/card";
import { GradientButton } from "@/components/sliders/gradient-button";

import ProfileAvatarPanel from "@/components/profile/profile-avatar-panel";
import ProfileDetailsPanel from "@/components/profile/profile-details-panel";
import ProfileStats from "@/components/profile/profile-stats";
import ProfileMetadata from "@/components/profile/profile-metadata";
import EditProfileFab from "@/components/profile/edit-profile-fab";

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
        const data = await gqlClient.request<{
          getCurrentUser: UserProfile | null;
        }>(GET_CURRENT_USER, { clerkId: user.id });
        setProfile(data.getCurrentUser);
      } catch {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

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
          <p className="text-muted-foreground text-lg">Profile not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5 overflow-auto">
      {/* Mobile Layout (below lg) - Tinder-style horizontal top section */}
      <div className="lg:hidden min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 p-5 space-y-5">
          
          {/* Top Section: Profile Pic (Left) + Name/Age/Bio (Right) */}
          <div className="flex gap-4 items-start">
            {/* Profile Picture - Smaller */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="relative aspect-square w-28 sm:w-32 rounded-2xl overflow-hidden ring-2 ring-primary/20 shadow-lg">
                  <Image
                    src={profile.photos?.[0] ?? "/placeholder.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Edit Button */}
                {setProfile && (
                  <div className="absolute -bottom-2 -right-2 z-20">
                    <EditProfileFab
                      profile={profile}
                      onProfileUpdate={setProfile}
                      className="h-10 w-10 shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Name, Age & Bio Details */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl font-bold truncate">
                  {profile.name.split(' ')[0]}
                </h1>
                <span className="text-xl text-muted-foreground">
                  {Math.floor(
                    (Date.now() - new Date(profile.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
                  )}
                </span>
              </div>
              {/* {profile.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {profile.bio}
                </p>
              )} */}
          <ProfileStats profile={profile} readonly={false} />
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-border/50"></div>
          
          {/* Stats */}
          
          {/* Divider */}
          <div className="border-t border-border/50"></div>
          
          {/* Metadata */}
          <ProfileMetadata profile={profile} />
          
          {/* Profile Details (Photos & Preferences) */}
          <ProfileDetailsPanel profile={profile} />
        </div>
      </div>

      {/* Desktop Layout (lg+) - Two panels */}
      <div className="hidden lg:flex items-center justify-center px-6 py-6 min-h-[calc(100vh-64px)]">
        <div
          className="
            w-full
            max-w-7xl
            flex flex-row gap-10
            bg-card/80 backdrop-blur-xl
            rounded-3xl 
            shadow-[0_10px_40px_rgba(0,0,0,0.15)]
            dark:shadow-[0_10px_40px_rgba(255,255,255,0.05),0_0_60px_rgba(var(--primary-rgb),0.15)]
            border border-border/50
            p-12
            transition-all duration-500
            hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)]
            dark:hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)]
          "
        >
          {/* Left Panel - Avatar, Stats, and Metadata */}
          <div className="flex-shrink-0 w-1/3 max-w-sm flex flex-col justify-center">
            <ProfileAvatarPanel profile={profile} onProfileUpdate={setProfile} />
          </div>

          {/* Right Panel - Details (Header, Photos, Preferences) */}
          <div className="flex-grow min-w-0 flex flex-col justify-center">
            <ProfileDetailsPanel profile={profile} />
          </div>
        </div>
      </div>
    </main>
  );
}
