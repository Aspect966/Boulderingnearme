"use client";

import { useMemo, useState, useTransition } from "react";
import { submitDifficultyRating } from "@/app/actions/ratings";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  calculateConsensusGrade,
  DEFAULT_SCALE,
  formatConsensusGrade,
  GRADE_SCALES,
  type GradeScale,
} from "@/lib/grades";
import type { DifficultyRating } from "@/lib/types";

export function DifficultyRatingForm({
  boulderId,
  primaryScale,
  consensusVGrade,
  ratings,
  isLoggedIn,
}: {
  boulderId: string;
  primaryScale: GradeScale;
  consensusVGrade: number | null;
  ratings: DifficultyRating[];
  isLoggedIn: boolean;
}) {
  const [scale, setScale] = useState<GradeScale>(DEFAULT_SCALE);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const grades = useMemo(
    () => GRADE_SCALES.find((s) => s.id === scale)?.grades ?? [],
    [scale]
  );

  const preview = calculateConsensusGrade(ratings.map((r) => r.v_equivalent));
  const displayGrade = formatConsensusGrade(
    consensusVGrade ?? preview,
    primaryScale
  );

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitDifficultyRating(boulderId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Community grade</h2>
            <p className="text-sm text-stone-600">
              Outliers are filtered automatically. Grades are whole numbers.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-100 px-4 py-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Consensus
            </p>
            <p className="text-2xl font-bold text-amber-900">{displayGrade}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Ratings" value={String(ratings.length)} />
          <Stat
            label="Scale"
            value={GRADE_SCALES.find((s) => s.id === primaryScale)?.shortName ?? "V"}
          />
          <Stat
            label="Raw average"
            value={
              preview !== null
                ? formatConsensusGrade(preview, primaryScale)
                : "—"
            }
          />
        </div>

        {ratings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ratings.map((rating) => (
              <span
                key={rating.id}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
              >
                {rating.grade_label} ({GRADE_SCALES.find((s) => s.id === rating.scale)?.shortName})
              </span>
            ))}
          </div>
        )}

        {isLoggedIn ? (
          <form action={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Select
              name="scale"
              value={scale}
              onChange={(e) => setScale(e.target.value as GradeScale)}
            >
              {GRADE_SCALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select name="grade_label" required defaultValue="">
              <option value="" disabled>
                Select grade
              </option>
              {grades.map((g) => (
                <option key={g.label} value={g.label}>
                  {g.label}
                </option>
              ))}
            </Select>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Rate climb"}
            </Button>
          </form>
        ) : (
          <p className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
            Log in to rate this boulder after your send.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}
