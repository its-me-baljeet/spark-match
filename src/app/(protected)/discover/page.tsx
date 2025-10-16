// app/discover/page.tsx
"use client";

import gqlClient from "@/services/graphql";
import { GET_PREFERRED_USERS } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { TinderCard } from "@/components/discover/tinder-card";
import { UserProfile } from "@/types";

export default function Page() {
  const user = useUser();
  const [cursor, setCursor] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      if (!user.user) return;
      const res: {
        getPreferredUsers: UserProfile[];
      } = await gqlClient.request(GET_PREFERRED_USERS, {
        clerkId: user.user.id,
        limit: 12,
        cursor,
      });
      console.log(res.getPreferredUsers);
      if (res.getPreferredUsers.length > 0) {
        setUsers(res.getPreferredUsers);
        setCursor(res.getPreferredUsers[res.getPreferredUsers.length - 1].id);
      }
    }
    fetchUsers();
  }, [user.user]);

  const onSwipe = async (dir: "left" | "right") => {};

  const onOpen = () => {};
  return (
    <main className="w-full h-[calc(100vh-54px)] flex flex-col items-center justify-center px-4 sm:px-6">
      {users.length === 0 ? (
        <p className="text-gray-600">
          No users found matching your preferences.
        </p>
      ) : (
        // <TinderCard users={users} />
        users.map((u) => {
          return (
            <TinderCard key={u.id} user={u} onSwipe={onSwipe} onOpen={onOpen} />
          );
        })
      )}
    </main>
  );
}
