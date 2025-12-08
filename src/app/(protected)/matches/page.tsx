"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import gqlClient from "@/services/graphql";
import { GET_MY_MATCHES } from "@/utils/queries";
import { UserProfile } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getLastSeenText } from "@/utils/helper";
import { Trash2 } from "lucide-react";
import { DELETE_MATCH } from "@/utils/mutations";
import ChatPlaceholder from "@/components/discover/chat-placeholder";

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

  async function handleDelete(userId: string) {
    try {
      const data: {
        deleteMatch: boolean;
      } = await gqlClient.request(DELETE_MATCH, {
        userId: userId,
      });
      if (data.deleteMatch) {
        setMatches((prev) => prev.filter((match) => match.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-150px)] md:h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="h-8 w-8 md:w-16 md:h-16 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">💞</div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            No Matches Yet
          </h2>
          <p className="text-muted-foreground text-lg">
            Keep swiping to find your perfect match! ⚡
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[1600px] mx-auto flex flex-col  lg:flex-row gap-0 lg:gap-6">
        <div className="w-full lg:w-[40%] xl:w-[35%] ">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                Matches
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {matches.length} {matches.length === 1 ? "match" : "matches"}{" "}
                ready to chat 💬
              </p>
            </div>

            {/* Matches List (Tinder style) */}
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="group flex items-center justify-between bg-card/80 backdrop-blur-md p-4 rounded-2xl 
                       hover:shadow-lg transition-all duration-300 border border-border/50"
                >
                  {/* Left Side: Avatar + info */}
                  <Link
                    href={`/profile/${match.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    {/* Avatar */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                      {/* Avatar circle that clips ONLY the image */}
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-md">
                        <Image
                          src={match.photos?.[0] ?? "/placeholder.jpg"}
                          fill
                          alt={match.name}
                          className="object-cover"
                        />
                      </div>

                      {/* Online dot, allowed to overflow slightly */}
                      {match.isOnline && (
                        <span
                          className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full
                 ring-2 ring-white animate-pulse z-10"
                        />
                      )}
                    </div>

                    {/* Name, Age & Bio */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold truncate">
                          {match.name}
                        </h2>
                        {match.age && (
                          <span className="text-muted-foreground">
                            {match.age}
                          </span>
                        )}
                      </div>

                      {/* Last seen or bio */}
                      <p className="text-sm text-muted-foreground truncate max-w-[170px] sm:max-w-[240px]">
                        {match.isOnline
                          ? "Active now"
                          : getLastSeenText(match.lastActiveAt) ||
                            "Recently active"}
                      </p>
                    </div>
                  </Link>

                  {/* Right Side: Action Button */}
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="ml-3 p-2 rounded-full bg-muted/30 hover:bg-rose-500 hover:text-white transition-all
                         duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete match"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – Placeholder for Chat UI */}
        <div className="hidden lg:flex w-full lg:w-[60%] xl:w-[65%] lg:h-[calc(100vh-125px)]  items-center justify-center bg-card/60 backdrop-blur-md rounded-3xl border border-border/50 shadow-lg">
          <ChatPlaceholder />
        </div>
      </div>
    </div>
  );
}
