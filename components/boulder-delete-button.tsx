"use client";

import { useState, useTransition } from "react";
import { deleteBoulder } from "@/app/actions/boulders";
import { Button } from "@/components/ui/button";

export function BoulderDeleteButton({
  boulderId,
  boulderName,
}: {
  boulderId: string;
  boulderName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteBoulder(boulderId);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-red-200 text-red-700 hover:bg-red-50"
          onClick={() => setConfirming(true)}
        >
          Delete listing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-900">
        Delete <span className="font-semibold">{boulderName}</span>? This removes the
        listing, photos, ratings, and comments permanently.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="bg-red-600 hover:bg-red-700"
          disabled={pending}
          onClick={handleDelete}
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
