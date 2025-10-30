// app/discover/page.tsx
"use client";

import gqlClient from "@/services/graphql";
import { GET_PREFERRED_USERS } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { TinderCard } from "@/components/discover/tinder-card";
import { UserProfile } from "@/types";
import { LIKE_USER } from "@/utils/mutations";

export default function Page() {
  const user = useUser();
  const [cursor, setCursor] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // ✅ Fetch preferred users
  useEffect(() => {
    async function fetchUsers() {
      if (!user.user) return;
      const res: { getPreferredUsers: UserProfile[] } = await gqlClient.request(
        GET_PREFERRED_USERS,
        {
          clerkId: user.user.id,
          limit: 12,
          cursor,
        }
      );
      if (res.getPreferredUsers.length > 0) {
        setUsers(res.getPreferredUsers);
        setCursor(res.getPreferredUsers[res.getPreferredUsers.length - 1].id);
      }
    }
    fetchUsers();
  }, [user.user]);

  // ✅ Handle swipe logic (connects to backend)
  const handleSwipe = async (dir: "left" | "right", swipedUser: UserProfile) => {
    console.log(`Swiped ${dir} on ${swipedUser.name}`);

    if (dir === "right" && user.user) {
      try {
        // ✅ Run LIKE_USER mutation
        await gqlClient.request(LIKE_USER, {
          fromClerkId: user.user.id,
          toUserId: swipedUser.id,
        });
        console.log(`✅ Liked ${swipedUser.name}`);
      } catch (error) {
        console.error("❌ Error liking user:", error);
      }
    }

    // Remove swiped card from stack
    setUsers((prev) => prev.filter((u) => u.id !== swipedUser.id));
  };

  // ✅ Open profile modal (you can later add a modal UI)
  const onOpen = (user: UserProfile) => {
    console.log("Open profile of", user.name);
  };

  return (
    <main className="relative w-full h-[calc(100vh-64px)] flex items-center justify-center bg-background px-4 sm:px-6 overflow-hidden">
      {users.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium">
          No users found matching your preferences.
        </p>
      ) : (
        <div className="relative w-full max-w-[420px] h-[78vh] flex items-center justify-center">
          {users
            .slice(0, 3) // only top 3 visible
            .reverse() // render topmost last
            .map((u, index) => (
              <div
                key={u.id}
                className="absolute inset-0 flex justify-center items-center transition-all duration-300"
                style={{ zIndex: index + 1 }}
              >
                <TinderCard
                  user={u}
                  isTop={index === 0}
                  onSwipe={(dir) => handleSwipe(dir, u)}
                  onOpen={() => onOpen(u)}
                  styleIndex={index}
                />
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
