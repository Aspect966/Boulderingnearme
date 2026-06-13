"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addComment(boulderId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/boulders/${boulderId}`);

  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "Comment cannot be empty." };

  const { error } = await supabase.from("comments").insert({
    boulder_id: boulderId,
    user_id: user.id,
    content,
  });

  if (error) return { error: error.message };

  revalidatePath(`/boulders/${boulderId}`);
  return { success: true };
}
