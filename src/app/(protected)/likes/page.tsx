// app/likes/page.tsx

"use client";

import gqlClient from "@/services/graphql";
import { GET_USERS_WHO_LIKED_ME } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { TinderCard } from "@/components/discover/tinder-card";
import { handleSwipeHelper } from "@/utils/handleSwipe";
import { LoadingSpinner } from "@/components/loader/loading-spinner";

import { AnimatePresence, motion } from "framer-motion";

export default function LikesPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch users who liked me
  useEffect(() => {
    if (!user) return;

    const fetchLikes = async () => {
      try {
        setLoading(true);
        const res = await gqlClient.request<{ getUsersWhoLikedMe: UserProfile[] }>(
          GET_USERS_WHO_LIKED_ME,
          { clerkId: user.id }
        );
        setUsers(res.getUsersWhoLikedMe);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user]);

  // ❤️ Swipe handling (like/pass)
  const handleSwipe = async (dir: "left" | "right", swipedUser: UserProfile) => {
    if (!user) return;
    await handleSwipeHelper({
      dir,
      swipedUser,
      currentUserId: user.id,
      setUsers,
    });
  };

  return (
    <main className="flex justify-center items-center h-[calc(100vh-64px)] px-4">
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : users.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg font-medium leading-relaxed">
          No new likes yet.<br />
          🔁 Keep swiping in <span className="font-semibold text-primary">Discover</span>!
        </p>
      ) : (
        <div className="relative max-w-[420px] w-full h-[80vh]">
          <AnimatePresence>
            {users
              .slice(0, 3) // only show first 3
              .reverse() // render topmost last
              .map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: i + 1 }}
                >
                  <TinderCard
                    user={u}
                    isTop={i === 0}
                    onSwipe={(dir) => handleSwipe(dir, u)}
                    onOpen={() => console.log("Open profile of:", u.name)}
                    styleIndex={i}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
