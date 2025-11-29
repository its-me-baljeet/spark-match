// components/profile/ProfileMediaRail.tsx
"use client";

import Image from "next/image";

interface Props {
  photos: string[];
}

export default function ProfileMediaRail({ photos }: Props) {
  if (photos.length <= 1) return null;

  const rest = photos.slice(1);

  return (
    <section className="pt-2">
      <div className="px-5 flex justify-between items-center mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Photos
        </h2>
      </div>

      <div className="-mx-5 px-5 pb-3 flex gap-3 overflow-x-auto scrollbar-hide">
        {rest.map((photo, idx) => (
          <div
            key={idx}
            className="relative h-24 w-20 rounded-2xl overflow-hidden flex-shrink-0 bg-muted"
          >
            <Image
              src={photo}
              alt={`Photo ${idx + 2}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
