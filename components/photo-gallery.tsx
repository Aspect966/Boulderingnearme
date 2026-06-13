import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { sortPhotosForDisplay } from "@/lib/photos";
import { getPhotoPublicUrl } from "@/lib/storage";
import type { BoulderPhoto } from "@/lib/types";

export function PhotoGallery({ photos }: { photos: BoulderPhoto[] }) {
  const sortedPhotos = sortPhotosForDisplay(photos);

  if (sortedPhotos.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200">
        <p className="text-sm text-stone-500">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sortedPhotos.map((photo, index) => (
        <div
          key={photo.id}
          className={`relative overflow-hidden rounded-2xl bg-stone-100 ${
            index === 0 ? "sm:col-span-2 lg:col-span-2 sm:row-span-2 aspect-[16/10]" : "aspect-square"
          }`}
        >
          {photo.is_thumbnail && (
            <div className="absolute left-3 top-3 z-10">
              <Badge tone="accent">Thumbnail</Badge>
            </div>
          )}
          <Image
            src={getPhotoPublicUrl(photo.storage_path)}
            alt="Boulder photo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
