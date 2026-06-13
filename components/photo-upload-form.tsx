"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadBoulderPhoto } from "@/app/actions/photos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PhotoUploadForm({ boulderId }: { boulderId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Please choose a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    startTransition(async () => {
      try {
        const result = await uploadBoulderPhoto(boulderId, formData);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          if (inputRef.current) inputRef.current.value = "";
          router.refresh();
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-stone-900">Add a photo</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-800 hover:file:bg-stone-200"
          />
          <p className="text-xs text-stone-400">JPEG, PNG, WebP or GIF · max 30 MB</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">Photo added successfully.</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading…" : "Upload photo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
