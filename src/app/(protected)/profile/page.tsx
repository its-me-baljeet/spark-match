"use client";
import { Card, SectionHeader } from "@/components/cards/card";
import ProfileEditForm from "@/components/dialogs/edit-profile-dialog";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import { GradientButton } from "@/components/sliders/gradient-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import gqlClient from "@/services/graphql";
import { UserProfile } from "@/types";
import { GET_CURRENT_USER } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { Calendar, Camera, Heart, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-background dark:via-card/30 dark:to-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-background dark:via-card/30 dark:to-background flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <p className="text-destructive text-lg font-medium">{error}</p>
          <GradientButton onClick={() => window.location.reload()}>
            Try Again
          </GradientButton>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-background dark:via-card/30 dark:to-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">Profile not found.</p>
        </Card>
      </div>
    );
  }

  const mainPhoto = profile.photos?.[0];
  const age = Math.floor(
    (Date.now() - new Date(profile.birthday).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-background dark:via-card/30 dark:to-background py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Hero Section */}
        <Card gradient className="overflow-hidden relative">
          {/* Photo Section */}
          {mainPhoto ? (
            <div className="relative h-60 md:h-[500px]">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-full cursor-pointer group">
                    <Image
                      src={mainPhoto}
                      alt="Profile"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </DialogTrigger>

                <DialogContent className="w-full max-w-6xl p-0 bg-black">
                  <DialogHeader className="p-6 bg-gradient-to-b from-black/80 to-transparent">
                    <DialogTitle className="text-xl text-center text-white">
                      {profile.name} Photos
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {profile.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="relative w-full min-w-full h-96 md:h-[600px] snap-center"
                      >
                        <Image
                          src={photo}
                          alt={`Photo ${i + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="h-60 md:h-[500px] bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/20 dark:to-orange-900/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No photos uploaded yet</p>
              </div>
            </div>
          )}

          {/* 🟢 Floating Edit Button → stays on top of everything */}
          <div className="absolute top-6 right-6 z-20">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-white/90 hover:bg-white text-gray-900 shadow-xl backdrop-blur-sm px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Edit Your Profile
                  </DialogTitle>
                </DialogHeader>

                <ProfileEditForm
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* 🧑 Profile Info Overlay → Always Visible */}
          <div className="absolute bottom-6 left-6 z-10 text-white">
            <h1 className="text-4xl font-bold">
              {profile.name}, {age}
            </h1>
            {profile.bio && (
              <p className="text-white/80 text-lg max-w-xl">{profile.bio}</p>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <SectionHeader
                title="About"
                icon={<Heart className="h-4 w-4" />}
                subtitle="Basic information"
              />

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <span>
                    {profile.location?.lat && profile.location?.lng
                      ? `${profile.location.lat.toFixed(
                          2
                        )}, ${profile.location.lng.toFixed(2)}`
                      : "Location not set"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5 text-pink-500" />
                  <span>
                    Joined{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Photos Grid */}
            {profile.photos.length > 1 && (
              <Card className="p-6">
                <SectionHeader
                  title="Photos"
                  icon={<Camera className="h-4 w-4" />}
                  subtitle={`${profile.photos.length} photos`}
                />

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.slice(1).map((photo, i) => (
                    <div
                      key={i}
                      className="aspect-square relative rounded-2xl overflow-hidden group"
                    >
                      <Image
                        src={photo}
                        alt={`Photo ${i + 2}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Preferences Sidebar */}
          {profile.preferences && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-900/10 dark:to-orange-900/10">
                <SectionHeader
                  title="Dating Preferences"
                  icon={<Heart className="h-4 w-4" />}
                />

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-card rounded-xl border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">
                      Age Range
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {profile.preferences.minAge} -{" "}
                      {profile.preferences.maxAge} years
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-xl border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">
                      Max Distance
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {profile.preferences.distanceKm} km
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-xl border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">
                      Looking for
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {profile.preferences.gender
                        ? profile.preferences.gender.charAt(0) +
                          profile.preferences.gender.slice(1).toLowerCase()
                        : "Anyone"}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
