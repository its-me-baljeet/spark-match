// components/discover/tinder-card.tsx
"use client";

import React from "react";
import { motion, PanInfo } from "framer-motion";
import { UserProfile } from "@/types";
import Image from "next/image";
import { Heart, Send, X } from "lucide-react";

export type OnSwipeDir = "left" | "right";

interface TinderCardProps {
  user: UserProfile;
  isTop?: boolean;
  onSwipe: (dir: OnSwipeDir) => Promise<void> | void;
  onOpen: () => void;
  styleIndex?: number; // 0 = top, 1 = next, 2 = next
}

export const TinderCard: React.FC<TinderCardProps> = ({
  user,
  isTop = false,
  onSwipe,
  onOpen,
  styleIndex = 0,
}) => {
  // Visual offsets for stacked look
  const scaleMap = [1, 0.98, 0.96];
  const translateYMap = [0, 16, 32];

  const handleDragEnd = async (
    _: PointerEvent | TouchEvent | MouseEvent,
    info: PanInfo
  ) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const THRESH = 120; // px
    const VEL = 700; // px/s

    if (offsetX > THRESH || velocityX > VEL) {
      await onSwipe("right");
      return;
    }
    if (offsetX < -THRESH || velocityX < -VEL) {
      await onSwipe("left");
      return;
    }
    // return to center (framer-motion handles snapping with no explicit code here)
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: scaleMap[styleIndex] }}
      animate={{
        opacity: 1,
        scale: scaleMap[styleIndex],
        y: translateYMap[styleIndex],
      }}
      exit={{ opacity: 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      dragElastic={0.18}
      className="relative w-[90vw] max-w-[420px] h-[68vh] sm:h-[74vh] md:h-[78vh] rounded-2xl bg-card shadow-2xl overflow-hidden touch-pan-y"
      style={{
        boxShadow: "0 12px 40px rgba(2,6,23,0.45)",
      }}
    >
      {/* Image */}
      <button
        type="button"
        aria-label={`Open ${user.name}'s profile`}
        onClick={onOpen}
        className="w-full h-3/5 sm:h-3/5 block focus:outline-none"
        style={{ display: "block" }}
      >
        <div className="relative w-full h-full bg-gray-200/10">
          {/* Online Indicator */}
          {user.isOnline && (
            <div className="absolute top-3 left-3 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse z-10"></div>
          )}

          <Image
            src={user.photos?.[0] ?? "/placeholder.jpg"}
            alt={`${user.name} photo`}
            fill
            className="object-cover rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
          />
        </div>
      </button>

      {/* Info panel */}
      <div className="absolute bottom-0 left-0 right-0  bg-gradient-to-t from-black/75 to-transparent flex flex-col gap-4">
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
                {user.name}{" "}
                <span className="text-neutral-200 font-medium">
                  , {user.age}
                </span>
              </h3>
              {user.bio && (
                <p className="mt-1 text-sm sm:text-base text-white/80 line-clamp-3 max-w-full">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* Pass Button */}
          <button
            onClick={() => onSwipe("left")}
            aria-label="Pass"
            className="flex items-center justify-center bg-white/10 border border-white/20 hover:bg-red-500/90 text-white rounded-full backdrop-blur-md transition-transform active:scale-90 w-12 h-12 sm:w-14 sm:h-14"
          >
            <X />
          </button>

          {/* Message Button */}
          <button
            onClick={onOpen}
            aria-label="Message"
            className="flex items-center justify-center bg-white/10 border border-white/20 hover:bg-blue-500/90 text-white text-2xl rounded-full backdrop-blur-md transition-transform active:scale-90 w-12 h-12 sm:w-14 sm:h-14"
          >
            <Send />
          </button>

          {/* Like Button */}
          <button
            onClick={() => onSwipe("right")}
            aria-label="Like"
            className="flex items-center justify-center bg-white/10 border border-white/20 hover:bg-green-500/90 text-white rounded-full backdrop-blur-md transition-transform active:scale-90 w-12 h-12 sm:w-14 sm:h-14"
          >
            <Heart />
          </button>
        </div>
      </div>

      {/* Overlays for like/nope */}
      <motion.div
        className="absolute top-5 left-5 pointer-events-none select-none rounded px-3 py-1 border-2 text-lg font-bold"
        style={{
          borderColor: "rgba(34,197,94,0.9)",
          color: "rgba(34,197,94,0.95)",
          transform: "rotate(-12deg)",
          opacity: 0,
        }}
        // parent will control visibility via motion props if needed
      >
        LIKE
      </motion.div>
      <motion.div
        className="absolute top-5 right-5 pointer-events-none select-none rounded px-3 py-1 border-2 text-lg font-bold"
        style={{
          borderColor: "rgba(239,68,68,0.95)",
          color: "rgba(239,68,68,0.95)",
          transform: "rotate(12deg)",
          opacity: 0,
        }}
      >
        NOPE
      </motion.div>
    </motion.div>
  );
};
