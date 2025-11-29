import { Card, SectionHeader } from "@/components/cards/card";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function PhotosGrid({ photos }: { photos: string[] }) {
  return (
    <Card className="p-6">
      <SectionHeader title="Photos" icon={<Camera className="h-4 w-4" />} subtitle={`${photos.length} photos`} />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.slice(1).map((photo, idx) => (
          <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden group">
            <Image src={photo} alt={`Photo ${idx + 2}`} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </Card>
  );
}
