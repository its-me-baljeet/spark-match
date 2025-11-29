"use client";

import type { UserProfile } from "@/types";

interface ProfileStatsProps {
  profile: UserProfile;
  readonly?: boolean;
}

export default function ProfileStats({ profile, readonly }: ProfileStatsProps) {
  if (readonly) return null;

  const completion = Math.round(
    (
      [
        !!profile.bio,
        !!profile.photos.length,
        !!profile.preferences,
        !!profile.location,
      ].filter(Boolean).length / 4
    ) * 100
  );

  // Determine color based on completion
  const getColorClass = () => {
    if (completion >= 80) return "text-green-500";
    if (completion >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  const getGradientClass = () => {
    if (completion >= 80) return "from-green-500 to-emerald-500";
    if (completion >= 50) return "from-yellow-500 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 animate-fade-in">
      {/* Circular Progress */}
      <div className="relative w-20 h-20">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${(completion / 100) * 213.6} 213.6`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`${getGradientClass().split(' ')[0].replace('from-', 'text-')}`} stopColor="currentColor" />
              <stop offset="100%" className={`${getGradientClass().split(' ')[1].replace('to-', 'text-')}`} stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getColorClass()}`}>
            {completion}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground font-medium">
        Profile Complete
      </p>
    </div>
  );
}
