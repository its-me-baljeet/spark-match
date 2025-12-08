"use client";

export function TinderSearchLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 animate-fade">
      
      {/* Pulse Radar Circle */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"></div>
        <div className="absolute inset-4 rounded-full bg-red-500/70 animate-pulse"></div>
      </div>

      <p className="text-lg font-medium text-muted-foreground animate-bounce">
        Finding people near you...
      </p>
    </div>
  );
}
