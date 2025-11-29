"use client";

import { TinderCard } from "@/components/discover/tinder-card";
import gqlClient from "@/services/graphql";
import { UserProfile } from "@/types";
import { GET_PREFERRED_USERS } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card } from "@/components/cards/card";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import { GradientButton } from "@/components/sliders/gradient-button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { handleSwipeHelper } from "@/utils/handleSwipe";
import { REWIND_USER } from "@/utils/mutations";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type LastInteractionWithUser = {
  type: string;
  id: string;
  user: UserProfile;
};

export default function DiscoverPage() {
  const user = useUser();

  const [cursor, setCursor] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<
    LastInteractionWithUser | null | undefined
  >(null);

  // Filters
  const [distanceKm, setDistanceKm] = useState(50);
  const [onlyOnline, setOnlyOnline] = useState(false);

  const activeFilters = [
    distanceKm !== 50 ? "distance" : null,
    // onlyOnline ? "online" : null,
  ].filter(Boolean).length;

  const fetchUsers = async (
    forceRefetch = false,
    overrides?: {
      distanceKm?: number;
      onlyOnline?: boolean;
    }
  ) => {
    if (!user.user) return;
    setLoading(true);

    const distance = overrides?.distanceKm ?? distanceKm;
    const online = overrides?.onlyOnline ?? onlyOnline;

    try {
      const res: { getPreferredUsers: UserProfile[] } = await gqlClient.request(
        GET_PREFERRED_USERS,
        {
          clerkId: user.user.id,
          limit: 12,
          cursor: forceRefetch ? null : cursor,
          distanceKm: distance,
          onlyOnline: online,
        }
      );

      setUsers(res.getPreferredUsers);
      setCursor(
        res.getPreferredUsers.length > 0
          ? res.getPreferredUsers[res.getPreferredUsers.length - 1].id
          : null
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user.user]);

  const applyFilters = async () => {
    setCursor(null);
    await fetchUsers(true);
    setShowFilters(false);
  };

  const resetFilters = async () => {
    setDistanceKm(50);
    setOnlyOnline(false);
    setCursor(null);
    await fetchUsers(true);
  };

  const handleSwipe = async (
    dir: "left" | "right",
    swipedUser: UserProfile
  ) => {
    if (!user.user) return;

    setUsers(users.filter((u) => u.id !== swipedUser.id));
    const lastInteractionResp = await handleSwipeHelper({
      dir,
      swipedUser,
      currentUserId: user.user.id,
    });
    console.log("Last interaction after swipe:", lastInteractionResp);
    if (lastInteractionResp?.type && lastInteractionResp?.id) {
      setLastInteraction({
        type: lastInteractionResp.type,
        id: lastInteractionResp.id,
        user: swipedUser,
      });
    }
  };

  const handleRewind = async () => {
    if (!lastInteraction) return;

    try {
      console.log("Attempting to rewind:", lastInteraction);
      const variables = {
        lastInteraction: {
          type: lastInteraction.type,
          id: lastInteraction.id,
        },
      };

      const resp: { rewindUser: boolean } = await gqlClient.request(
        REWIND_USER,
        variables
      );

      if (resp.rewindUser) {
        setUsers((prev) => [lastInteraction.user, ...prev]);
        setLastInteraction(null);
        console.log("Rewind successful");
      }
    } catch (error) {
      console.error("Rewind failed:", error);
    }
  };

  return (
    <main className="relative w-full min-h-[calc(100vh-125px)] md:min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center overflow-hidden">
      {/* Filter Buttons Container - Aligned with Card */}
      {/* Filter Buttons Container - Aligned with Card */}
<div className="w-full max-w-[420px] px-4 pt-4 z-50 relative">
  <div className="flex gap-3 items-center">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full 
        backdrop-blur-xl border transition-all duration-300
        shadow-lg hover:shadow-xl active:scale-95
        ${ showFilters
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card/80 text-foreground border-border/50 hover:bg-card"
        }
      `}
    >
      <span className="font-medium text-sm">Range</span>
      <ChevronDown className="w-5 h-5" />
    </button>

    <div
      className={`flex items-center gap-2 ${onlyOnline ? "border-green-500 border-3 text-green-500" : "border-gray-500 border-2"} 
      border rounded-full px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300`}
      onClick={() => {
        setOnlyOnline(!onlyOnline);
        fetchUsers(true, { onlyOnline: !onlyOnline });
      }}
    >
      <p className="text-base">online</p>
    </div>
  </div>

  {/* Floating Animated Filter Panel */}
  <AnimatePresence>
    {showFilters && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-full mt-2"
      >
        <Card className="p-5 shadow-2xl border-border/50 bg-card/90 backdrop-blur-xl rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">Range</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">
                {distanceKm} km
              </span>
              <Slider
                min={1}
                max={200}
                step={1}
                value={[distanceKm]}
                onValueChange={(val) => setDistanceKm(val[0])}
                className="py-2"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <GradientButton variant="secondary" className="flex-1" onClick={resetFilters}>
              Reset
            </GradientButton>
            <GradientButton className="flex-1" onClick={applyFilters}>
              Apply
            </GradientButton>
          </div>
        </Card>
      </motion.div>
    )}
  </AnimatePresence>
</div>

      {/* Card Stack Section */}
      <div className="flex-1 w-full flex flex-col justify-center items-center relative py-6 -mt-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground animate-pulse">
              Finding people near you...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AdjustmentsHorizontalIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">No one new around you</h3>
            <p className="text-muted-foreground">
              Try adjusting your preferences to see more people.
            </p>
            {/* <GradientButton onClick={() => setShowFilters(true)} className="mt-4">
              Adjust Filters
            </GradientButton> */}
          </div>
        ) : (
          <div className="relative w-full max-w-[420px] h-[70vh] sm:h-[75vh] md:h-[80vh] flex items-center justify-center">
            <AnimatePresence>
              {users
                .slice(0, 3)
                .reverse()
                .map((u, i) => (
                  <div
                    key={u.id}
                    className="absolute inset-0 flex justify-center items-center perspective-1000"
                    style={{
                      zIndex: i + 1,
                      // Add slight offset for stacked look handled by TinderCard
                    }}
                  >
                    <TinderCard
                      user={u}
                      isTop={i === users.slice(0, 3).length - 1}
                      onRewind={handleRewind}
                      lastInteraction={lastInteraction}
                      onSwipe={(dir) => handleSwipe(dir, u)}
                      onOpen={() => console.log("Open profile")}
                      styleIndex={users.slice(0, 3).length - 1 - i}
                    />
                  </div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
