"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import gqlClient from "@/services/graphql";
import { GET_MY_MATCHES } from "@/utils/queries";
import { UserProfile } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getLastSeenText } from "@/utils/helper";

export default function MatchesPage() {
  const user = useUser();
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.user) return;
    const fetchMatches = async () => {
      try {
        const res = await gqlClient.request<{ getMyMatches: UserProfile[] }>(
          GET_MY_MATCHES,
          { clerkId: user.user.id }
        );
        setMatches(res.getMyMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user.user]);

  if (loading)
    return (
      <div className="h-[calc(100vh-64px)] flex justify-center items-center">
        <p>Loading matches...</p>
      </div>
    );

  return (
    <main className="p-4 h-[calc(100vh-64px)] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Your Matches 💞</h2>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches yet. Keep swiping! ⚡</p>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/chat/${match.id}`}
              className="flex items-center gap-4 p-3 rounded-lg shadow bg-card hover:bg-card/90 transition"
            >
              {/* Image Container (No overflow hidden here) */}
              <div className="relative w-16 h-16">
                {/* Inner image keeps overflow hidden */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={match.photos?.[0] || "/placeholder.jpg"}
                    alt={match.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Online Indicator (outside overflow area) */}
                {match.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg z-10"></div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <p className="font-medium">
                  {match.name}, {match.age}
                </p>
                <span className="text-xs text-muted-foreground">
                  {match.isOnline
                    ? "Online"
                    : getLastSeenText(match.lastActiveAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
