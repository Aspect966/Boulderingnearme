import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCoverPhoto } from "@/lib/photos";
import { formatConsensusGrade } from "@/lib/grades";
import { formatDistance } from "@/lib/geo";
import { getPhotoPublicUrl } from "@/lib/storage";
import type { Boulder, BoulderPhoto } from "@/lib/types";

export function BoulderCard({
  boulder,
  photos = [],
  distanceKm,
}: {
  boulder: Boulder;
  photos?: BoulderPhoto[];
  distanceKm?: number;
}) {
  const cover = getCoverPhoto(photos);
  const grade = formatConsensusGrade(
    boulder.consensus_v_grade,
    boulder.primary_scale
  );

  return (
    <Link href={`/boulders/${boulder.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-stone-300/40">
        <div className="relative aspect-[4/3] bg-stone-100">
          {cover ? (
            <Image
              src={getPhotoPublicUrl(cover.storage_path)}
              alt={boulder.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <span className="text-4xl opacity-40">🪨</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge tone="accent">{grade}</Badge>
          </div>
        </div>
        <div className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-700">
              {boulder.name}
            </h3>
            {distanceKm !== undefined && (
              <span className="shrink-0 text-xs font-medium text-stone-500">
                {formatDistance(distanceKm)}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm text-stone-600">
            {boulder.description || "No description yet."}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            {boulder.location_label}
          </p>
        </div>
      </Card>
    </Link>
  );
}
