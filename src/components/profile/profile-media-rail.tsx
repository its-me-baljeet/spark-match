"use client";

import Image from "next/image";

interface Props {
  photos: string[];
  openAtIndex: (index: number) => void;
}

export default function ProfileMediaRail({ photos, openAtIndex }: Props) {
  if (photos.length <= 1) return null;

  const rest = photos.slice(1);

  return (
    <section className="pt-2 w-full">
      <div className="-mx-5 px-5 flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {rest.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => openAtIndex(idx + 1)}
            className="relative h-24 w-20 rounded-2xl overflow-hidden bg-muted"
          >
            <Image src={photo} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
