"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { UserProfile } from "@/types";

interface LikesCardProps {
  user: UserProfile;
  onLike: () => void;
  onPass: () => void;
  onOpen: () => void;
}

export const LikesCard: React.FC<LikesCardProps> = ({
  user,
  onLike,
  onPass,
  onOpen,
}) => {
  return (
    <div
      className="
        relative w-[90vw] max-w-[400px] h-[70vh] sm:h-[75vh] md:h-[75vh]
        rounded-3xl bg-card shadow-2xl overflow-hidden 
        select-none cursor-pointer
      "
      style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}
      onClick={onOpen}
    >
      {/* FULL CARD AREA */}
      <div className="w-full h-full relative group">
        {/* IMAGE */}
        <Image
          src={user.photos?.[0] ?? "/placeholder.jpg"}
          alt={user.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

        {/* ONLINE BADGE */}
        {user.isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white/90">Online</span>
          </div>
        )}

        {/* INFO SECTION */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-20">
          <div className="flex items-end gap-3 mb-2">
            <h3 className="text-3xl font-bold text-white drop-shadow-md">
              {user.name}
            </h3>
            <span className="text-2xl text-white/80 drop-shadow-md">
              {user.age}
            </span>
          </div>

          {user.bio && (
            <p className="text-white/90 line-clamp-2 max-w-[90%] drop-shadow-sm">
              {user.bio}
            </p>
          )}

          {/* VIEW PROFILE */}
          <Link
            href={`/profile/${user.id}`}
            onClick={(e) => e.stopPropagation()}
            className="
              mt-4 flex items-center gap-2 text-white/60 text-sm font-medium 
              opacity-0 group-hover:opacity-100 transition-all duration-300 
              translate-y-2 group-hover:translate-y-0
            "
          >
            <span>View Profile</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ⭐ ACTION BUTTONS ⭐ */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-20">
        {/* PASS BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPass();
          }}
          className="
            flex items-center justify-center 
            w-14 h-14 rounded-full 
            bg-black/20 backdrop-blur-xl border border-white/10
            text-rose-500 
            hover:bg-rose-500 hover:text-white hover:border-rose-500
            transition-all duration-300 hover:scale-110 active:scale-95
            shadow-lg
          "
        >
          <X className="w-7 h-7" strokeWidth={2.5} />
        </button>

        {/* LIKE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="
            flex items-center justify-center 
            w-14 h-14 rounded-full 
            bg-black/20 backdrop-blur-xl border border-white/10
            text-emerald-500 
            hover:bg-emerald-500 hover:text-white hover:border-emerald-500
            transition-all duration-300 hover:scale-110 active:scale-95
            shadow-lg
          "
        >
          <Heart className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
