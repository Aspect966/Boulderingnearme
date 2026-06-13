"use client";

import { useState, useTransition } from "react";
import { uploadBoulderPhoto } from "@/app/actions/photos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PhotoUploadForm({ boulderId }: { boulderId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await uploadBoulderPhoto(boulderId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-stone-900">Add a photo</h2>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-3">
          <input
            type="file"
            name="photo"
            accept="image/*"
            required
            className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-800 hover:file:bg-stone-200"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading..." : "Upload photo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
