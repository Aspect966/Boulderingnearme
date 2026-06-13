"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getGradeOption } from "@/lib/grades";
import type { GradeScale } from "@/lib/grades";
import { createClient } from "@/lib/supabase/server";

export async function submitDifficultyRating(boulderId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/boulders/${boulderId}`);

  const scale = String(formData.get("scale") ?? "v_scale") as GradeScale;
  const gradeLabel = String(formData.get("grade_label") ?? "").trim();
  const grade = getGradeOption(scale, gradeLabel);

  if (!grade) {
    return { error: "Please select a valid grade." };
  }

  const { error } = await supabase.from("difficulty_ratings").upsert(
    {
      boulder_id: boulderId,
      user_id: user.id,
      scale,
      grade_label: grade.label,
      v_equivalent: grade.vEquivalent,
    },
    { onConflict: "boulder_id,user_id" }
  );

  if (error) return { error: error.message };

  revalidatePath(`/boulders/${boulderId}`);
  revalidatePath("/");
  return { success: true };
}
