"use client";

import gqlClient from "@/services/graphql";
import { GET_PREFERRED_USERS } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { TinderCard } from "@/components/discover/tinder-card";
import { UserProfile } from "@/types";
import { LIKE_USER, PASS_USER, UNDO_PASS } from "@/utils/mutations";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/cards/card";
import { GradientButton } from "@/components/sliders/gradient-button";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { handleSwipeHelper } from "@/utils/handleSwipe";

export default function DiscoverPage() {
  const user = useUser();

  const [cursor, setCursor] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [undoUser, setUndoUser] = useState<UserProfile | null>(null);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Filters
  const [distanceKm, setDistanceKm] = useState(50);
  const [onlyOnline, setOnlyOnline] = useState(false);

  const activeFilters = [
    distanceKm !== 50 ? "distance" : null,
    onlyOnline ? "online" : null,
  ].filter(Boolean).length;

  const fetchUsers = async (forceRefetch = false) => {
    if (!user.user) return;
    setLoading(true);

    try {
      const res: { getPreferredUsers: UserProfile[] } = await gqlClient.request(
        GET_PREFERRED_USERS,
        {
          clerkId: user.user.id,
          limit: 12,
          cursor: forceRefetch ? null : cursor,
          distanceKm,
          onlyOnline,
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

    await handleSwipeHelper({
      dir,
      swipedUser,
      currentUserId: user.user.id,
      setUsers,
      setUndoUser,
      setUndoTimer,
    });
  };

  return (
    <main className="relative w-full min-h-[calc(100vh-64px)] bg-background flex flex-col items-center px-4">
      {/* 🔥 Properly Positioned Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="absolute top-[30px] left-4 bg-card shadow-md px-4 py-2 rounded-md flex items-center gap-2 z-30"
      >
        <AdjustmentsHorizontalIcon className="w-5 h-5 text-pink-500" />
        <span className="font-medium text-sm">Filters</span>
        {activeFilters > 0 && (
          <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs">
            {activeFilters}
          </span>
        )}
      </button>

      {/* 🪄 Animated Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] left-4 max-w-[330px] w-full z-40"
          >
            <Card className="p-4 shadow-lg border bg-card/90 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold text-sm">Filters</span>
                </div>
                <button onClick={() => setShowFilters(false)}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Max Distance: {distanceKm} km</Label>
                  <Slider
                    min={1}
                    max={200}
                    step={1}
                    value={[distanceKm]}
                    onValueChange={(val) => setDistanceKm(val[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Only online</Label>
                  <Switch
                    checked={onlyOnline}
                    onCheckedChange={setOnlyOnline}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <GradientButton className="flex-1" onClick={applyFilters}>
                  Apply
                </GradientButton>
                <GradientButton
                  variant="secondary"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Reset
                </GradientButton>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🃏 Card Section (proper spacing & working) */}
      <div className="mt-[100px] flex justify-center items-center w-full flex-1">
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <div className="relative w-full max-w-[420px] h-[78vh]">
            {users
              .slice(0, 3)
              .reverse()
              .map((u, i) => (
                <div
                  key={u.id}
                  className="absolute inset-0 flex justify-center items-center"
                  style={{ zIndex: i + 1 }}
                >
                  <TinderCard
                    user={u}
                    isTop={i === 0}
                    onSwipe={(dir) => handleSwipe(dir, u)}
                    onOpen={() => console.log("Open profile")}
                    styleIndex={i}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      {undoUser && (
        <div className="fixed bottom-20 flex items-center gap-3 bg-black/70 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-fade-in z-[999]">
          <span>👎 Passed {undoUser.name}</span>
          <button
            onClick={async () => {
              if (undoTimer) clearTimeout(undoTimer);

              await gqlClient.request(UNDO_PASS, {
                fromClerkId: user.user?.id,
                toUserId: undoUser.id,
              });

              setUsers((prev) => [undoUser!, ...prev]); // Put back on top
              setUndoUser(null);
            }}
            className="text-green-400 font-bold hover:text-green-300"
          >
            Undo
          </button>
        </div>
      )}
    </main>
  );
}
