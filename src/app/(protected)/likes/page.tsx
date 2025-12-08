"use client";

import gqlClient from "@/services/graphql";
import { GET_USERS_WHO_LIKED_ME } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { LoadingSpinner } from "@/components/loader/loading-spinner";
import { LikesCard } from "@/components/cards/like-card";
import { handleSwipeHelper } from "@/utils/handleSwipe";

export default function LikesPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikes = async () => {
      try {
        setLoading(true);
        const res = await gqlClient.request<{
          getUsersWhoLikedMe: UserProfile[];
        }>(GET_USERS_WHO_LIKED_ME, { clerkId: user.id });

        setUsers(res.getUsersWhoLikedMe);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user]);

  // ⭐ FIXED handleSwipe() for Likes Page
  const handleSwipe = async (
    dir: "left" | "right",
    swipedUser: UserProfile
  ) => {
    if (!user?.id) return;

    // Remove from UI instantly
    setUsers((prev) => prev.filter((u) => u.id !== swipedUser.id));

    // Perform like or pass action
    await handleSwipeHelper({
      dir,
      swipedUser,
      currentUserId: user.id, // clerkId
    });
  };

  return (
    <main className="px-4 py-6 min-h-[calc(100vh-120px)]">
      {loading ? (
        <div className="flex justify-center mt-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center max-w-md min-h-[80vh] md:min-h-[calc(100vh-120px)] flex flex-col items-center mx-auto justify-center">
          <div className="text-8xl mb-6">💞</div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            No Likes Yet
          </h2>
          <p className="text-muted-foreground text-lg">
            Keep swiping to find your perfect match! ⚡
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-xl md:text-2xl md: font-bold bg-gradient-to-r from-rose-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
            Likes You
          </h1>
          {users.map((u) => (
            <LikesCard
              key={u.id}
              user={u}
              onOpen={() => console.log("open", u.id)}
              onLike={() => handleSwipe("right", u)}
              onPass={() => handleSwipe("left", u)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
