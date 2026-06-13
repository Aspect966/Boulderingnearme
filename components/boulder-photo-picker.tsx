"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MAX_BOULDER_PHOTOS, validatePhotoFile } from "@/lib/photos";

type PendingPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

export function BoulderPhotoPicker({
  photos,
  thumbnailId,
  onPhotosChange,
  onThumbnailChange,
  onError,
}: {
  photos: PendingPhoto[];
  thumbnailId: string | null;
  onPhotosChange: (photos: PendingPhoto[]) => void;
  onThumbnailChange: (id: string | null) => void;
  onError: (message: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  function addPhotos(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    onError(null);

    const remainingSlots = MAX_BOULDER_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      onError(`You can add up to ${MAX_BOULDER_PHOTOS} photos.`);
      return;
    }

    const selectedFiles = Array.from(fileList).slice(0, remainingSlots);
    const nextPhotos: PendingPhoto[] = [];

    for (const file of selectedFiles) {
      const validationError = validatePhotoFile(file);
      if (validationError) {
        onError(validationError);
        nextPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
        return;
      }

      nextPhotos.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (fileList.length > remainingSlots) {
      onError(`Only ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} can be added.`);
    }

    const combined = [...photos, ...nextPhotos];
    onPhotosChange(combined);

    if (!thumbnailId && combined.length > 0) {
      onThumbnailChange(combined[0].id);
    }
  }

  function removePhoto(id: string) {
    const photo = photos.find((entry) => entry.id === id);
    if (photo) URL.revokeObjectURL(photo.previewUrl);

    const nextPhotos = photos.filter((entry) => entry.id !== id);
    onPhotosChange(nextPhotos);

    if (thumbnailId === id) {
      onThumbnailChange(nextPhotos[0]?.id ?? null);
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-900">Photos</p>
          <p className="text-xs text-stone-500">
            Add up to {MAX_BOULDER_PHOTOS} images. Choose one as the thumbnail shown on listings.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={photos.length >= MAX_BOULDER_PHOTOS}
          onClick={() => inputRef.current?.click()}
        >
          Add photos
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          addPhotos(event.target.files);
          event.target.value = "";
        }}
      />

      {photos.length > 0 ? (
        <>
          <p className="mt-4 text-xs font-medium text-stone-500">
            {photos.length} / {MAX_BOULDER_PHOTOS} photos
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => {
              const isThumbnail = photo.id === thumbnailId;

              return (
                <div
                  key={photo.id}
                  className={`relative overflow-hidden rounded-xl border bg-white ${
                    isThumbnail ? "border-amber-500 ring-2 ring-amber-200" : "border-stone-200"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.previewUrl}
                      alt="Selected boulder photo"
                      fill
                      className="object-cover"
                      sizes="160px"
                      unoptimized
                    />
                  </div>

                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    {isThumbnail && <Badge tone="accent">Thumbnail</Badge>}
                  </div>

                  <div className="flex flex-wrap gap-1 border-t border-stone-100 p-2">
                    {!isThumbnail && (
                      <button
                        type="button"
                        onClick={() => onThumbnailChange(photo.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
                      >
                        Set thumbnail
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-4 py-10 text-center transition hover:border-amber-300 hover:bg-amber-50/40"
        >
          <span className="text-sm font-medium text-stone-800">Choose photos</span>
          <span className="mt-1 text-xs text-stone-500">PNG, JPG, or WEBP up to 5 MB each</span>
        </button>
      )}
    </div>
  );
}

export type { PendingPhoto };
