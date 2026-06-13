"use client";

import { useEffect, useMemo, useState } from "react";
import { BoulderCard } from "@/components/boulder-card";
import { Button } from "@/components/ui/button";
import { haversineDistanceKm } from "@/lib/geo";
import type { Boulder, BoulderPhoto } from "@/lib/types";

type BoulderRow = Boulder & { boulder_photos?: BoulderPhoto[] };

export function NearMeSection({ boulders }: { boulders: BoulderRow[] }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords) return;
  }, [coords]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }

    setLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setGeoError("Unable to access your location. Showing all boulders instead.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const sorted = useMemo(() => {
    if (!coords) {
      return boulders.map((boulder) => ({ boulder, distanceKm: undefined as number | undefined }));
    }

    return [...boulders]
      .map((boulder) => ({
        boulder,
        distanceKm: haversineDistanceKm(
          coords.lat,
          coords.lng,
          boulder.latitude,
          boulder.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [boulders, coords]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            {coords ? "Boulders near you" : "Explore boulders"}
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {coords
              ? "Sorted by distance from your current location."
              : "Use your location to find outdoor problems close by."}
          </p>
        </div>
        <Button
          type="button"
          variant={coords ? "outline" : "primary"}
          onClick={requestLocation}
          disabled={loading}
        >
          {loading ? "Finding you..." : coords ? "Refresh location" : "Use my location"}
        </Button>
      </div>

      {geoError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {geoError}
        </p>
      )}

      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map(({ boulder, distanceKm }) => (
            <BoulderCard
              key={boulder.id}
              boulder={boulder}
              photos={boulder.boulder_photos ?? []}
              distanceKm={coords ? distanceKm : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-stone-900">No boulders yet</p>
      <p className="mt-2 text-sm text-stone-600">
        Be the first to add an outdoor boulder in your area.
      </p>
    </div>
  );
}
