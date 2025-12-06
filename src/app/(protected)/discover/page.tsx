"use client";

import FiltersPanel from "@/components/discover/filters";
import { TinderCard } from "@/components/discover/tinder-card";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import gqlClient from "@/services/graphql";
import {
  UserPreferencesMeta,
  UserProfile,
  LastInteraction,
} from "@/types";
import { handleSwipeHelper } from "@/utils/handleSwipe";
import { GET_CURRENT_USER, GET_PREFERRED_USERS } from "@/utils/queries";
import { REWIND_USER } from "@/utils/mutations";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

// UI-extended version of LastInteraction to store swiped user
interface UILastInteraction extends LastInteraction {
  user: UserProfile;
}

export default function DiscoverPage() {
  const { user: clerkUser } = useUser();

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [lastInteraction, setLastInteraction] =
    useState<UILastInteraction | null>(null);

  // Temp filter values
  const [distanceKm, setDistanceKm] = useState(50);
  const [onlyOnline, setOnlyOnline] = useState(false);

  // Persistent stored preferences snapshot (from DB)
  const [storedPrefs, setStoredPrefs] = useState<UserPreferencesMeta | null>(
    null
  );

  /** 1️⃣ Load logged in user + stored filters from DB */
  useEffect(() => {
    if (!clerkUser?.id) return;

    const loadUser = async () => {
      try {
        const res = (await gqlClient.request(GET_CURRENT_USER, {
          clerkId: clerkUser.id,
        })) as { getCurrentUser: UserProfile | null };

        if (!res.getCurrentUser) return;

        setCurrentUser(res.getCurrentUser);

        if (res.getCurrentUser.preferences) {
          setDistanceKm(res.getCurrentUser.preferences.distanceKm);
          setStoredPrefs(res.getCurrentUser.preferences);
        }
      } catch (err) {
        console.error("User load failed:", err);
      }
    };

    loadUser();
  }, [clerkUser]);

  /** 2️⃣ Fetch preferred users (supports overrides for reset) */
  const fetchUsers = useCallback(
    async (
      forceRefetch = false,
      overrides?: { distanceKm?: number; onlyOnline?: boolean }
    ) => {
      if (!currentUser) return;
      setLoading(true);

      const effectiveDistance = overrides?.distanceKm ?? distanceKm;
      const effectiveOnline = overrides?.onlyOnline ?? onlyOnline;

      try {
        const res = (await gqlClient.request(GET_PREFERRED_USERS, {
          clerkId: currentUser.clerkId,
          limit: 12,
          cursor: forceRefetch ? null : cursor,
          distanceKm: effectiveDistance,
          onlyOnline: effectiveOnline,
        })) as { getPreferredUsers: UserProfile[] };

        setUsers(res.getPreferredUsers);

        setCursor(
          res.getPreferredUsers.length > 0
            ? res.getPreferredUsers[res.getPreferredUsers.length - 1].id
            : null
        );
      } catch (err) {
        console.error("Fetching users failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, cursor, distanceKm, onlyOnline]
  );

  /** 3️⃣ Fetch users when user profile loads */
  useEffect(() => {
    if (currentUser) fetchUsers(true);
  }, [currentUser, fetchUsers]);

  /** 4️⃣ Apply temporary filters */
  const applyFilters = async () => {
    setCursor(null);
    await fetchUsers(true);
    setShowFilters(false);
  };

  /** 5️⃣ Reset filters back to stored DB preferences */
  const resetFilters = async () => {
    if (!storedPrefs) return;

    const resetDistance = storedPrefs.distanceKm ?? 50;
    const resetOnline = false;

    // update UI
    setDistanceKm(resetDistance);
    setOnlyOnline(resetOnline);
    setCursor(null);

    // refetch using the reset values (no race with async state)
    await fetchUsers(true, {
      distanceKm: resetDistance,
      onlyOnline: resetOnline,
    });
  };

  /** 6️⃣ Tinder swipe handler */
  const handleSwipe = async (
    dir: "left" | "right",
    swipedUser: UserProfile
  ) => {
    if (!currentUser?.clerkId) return;

    setUsers((prev) => prev.filter((u) => u.id !== swipedUser.id));

    const resp = await handleSwipeHelper({
      dir,
      swipedUser,
      currentUserId: currentUser.clerkId,
    });

    if (resp?.type && resp?.id) {
      setLastInteraction({
        type: resp.type,
        id: resp.id,
        user: swipedUser,
      });
    }
  };

  /** 7️⃣ Rewind handler */
  const handleRewind = async () => {
    if (!lastInteraction) return;

    try {
      const resp = (await gqlClient.request(REWIND_USER, {
        lastInteraction: {
          type: lastInteraction.type,
          id: lastInteraction.id,
        },
      })) as { rewindUser: boolean };

      if (resp.rewindUser) {
        setUsers((prev) => [lastInteraction.user, ...prev]);
        setLastInteraction(null);
      }
    } catch (err) {
      console.error("Rewind failed:", err);
    }
  };

  return (
    <main className="relative w-full min-h-[calc(100vh-125px)] md:min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center overflow-hidden">
      <FiltersPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        distanceKm={distanceKm}
        onlyOnline={onlyOnline}
        setDistanceKm={setDistanceKm}
        setOnlyOnline={setOnlyOnline}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fetchUsers={fetchUsers}
      />

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
            <div
              onClick={resetFilters}
              className="cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-5 w-5" /> Refresh Suggestions
            </div>
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
                    className="absolute inset-0 flex justify-center items-center"
                    style={{ zIndex: i + 1 }}
                  >
                    <TinderCard
                      user={u}
                      isTop={i === users.slice(0, 3).length - 1}
                      onSwipe={(dir) => handleSwipe(dir, u)}
                      onRewind={handleRewind}
                      lastInteraction={lastInteraction}
                      onOpen={() => console.log("open profile")}
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
