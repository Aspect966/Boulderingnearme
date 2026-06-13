"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createBoulder } from "@/app/actions/boulders";
import { BoulderPhotoPicker, type PendingPhoto } from "@/components/boulder-photo-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  clearBoulderFormDraft,
  readBoulderFormDraft,
  writeBoulderFormDraft,
  type BoulderFormDraft,
} from "@/lib/boulder-form-draft";
import { DEFAULT_SCALE, GRADE_SCALES, type GradeScale } from "@/lib/grades";

const emptyDraft = (): BoulderFormDraft => ({
  name: "",
  locationLabel: "",
  description: "",
  scale: DEFAULT_SCALE,
  initialGrade: "",
  lat: "",
  lng: "",
});

export function BoulderForm() {
  const [draft, setDraft] = useState<BoulderFormDraft>(emptyDraft);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const grades = useMemo(
    () => GRADE_SCALES.find((s) => s.id === draft.scale)?.grades ?? [],
    [draft.scale]
  );

  useEffect(() => {
    const saved = readBoulderFormDraft();
    if (saved) setDraft(saved);
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    writeBoulderFormDraft(draft);
  }, [draft, draftLoaded]);

  function updateDraft(partial: Partial<BoulderFormDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateDraft({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setLocating(false);
      },
      () => {
        setError("Could not get your location.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    clearBoulderFormDraft();

    const formData = new FormData(event.currentTarget);
    photos.forEach((photo) => formData.append("photos", photo.file));

    const thumbnailIndex = thumbnailId
      ? photos.findIndex((photo) => photo.id === thumbnailId)
      : 0;
    formData.set(
      "thumbnail_index",
      String(thumbnailIndex >= 0 ? thumbnailIndex : 0)
    );

    const result = await createBoulder(formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
      writeBoulderFormDraft(draft);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-stone-900">Add a boulder</h1>
        <p className="mt-1 text-sm text-stone-600">
          Share an outdoor problem with location, photos, and your grade estimate.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Boulder name" required>
            <Input
              name="name"
              placeholder="e.g. The Mushroom Slab"
              required
              value={draft.name}
              onChange={(e) => updateDraft({ name: e.target.value })}
            />
          </Field>

          <Field label="Location label" required>
            <Input
              name="location_label"
              placeholder="e.g. Castle Rock State Park, CA"
              required
              value={draft.locationLabel}
              onChange={(e) => updateDraft({ locationLabel: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <Textarea
              name="description"
              placeholder="Approach, rock quality, beta, landing zone..."
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary grade scale">
              <Select
                name="primary_scale"
                value={draft.scale}
                onChange={(e) =>
                  updateDraft({
                    scale: e.target.value as GradeScale,
                    initialGrade: "",
                  })
                }
              >
                {GRADE_SCALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Your grade estimate">
              <Select
                name="initial_grade"
                value={draft.initialGrade}
                onChange={(e) => updateDraft({ initialGrade: e.target.value })}
              >
                <option value="">Skip for now</option>
                {grades.map((g) => (
                  <option key={g.label} value={g.label}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-900">GPS coordinates</p>
                <p className="text-xs text-stone-500">
                  Required so climbers can find the boulder. Decimal or DMS (e.g. 60°25&apos;26&quot;N).
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation}>
                {locating ? "Locating..." : "Use my location"}
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input
                name="latitude"
                placeholder={`Latitude (e.g. 60.423889 or 60°25'26"N)`}
                required
                value={draft.lat}
                onChange={(e) => updateDraft({ lat: e.target.value })}
              />
              <Input
                name="longitude"
                placeholder={`Longitude (e.g. 26.135556 or 26°08'08"E)`}
                required
                value={draft.lng}
                onChange={(e) => updateDraft({ lng: e.target.value })}
              />
            </div>
          </div>

          <BoulderPhotoPicker
            photos={photos}
            thumbnailId={thumbnailId}
            onPhotosChange={setPhotos}
            onThumbnailChange={setThumbnailId}
            onError={setError}
          />

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Creating..." : "Create boulder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="text-amber-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
