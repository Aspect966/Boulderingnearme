"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadPhotosForBoulder, validatePhotoFile } from "@/lib/photos";
import { createClient } from "@/lib/supabase/server";

export async function uploadBoulderPhoto(boulderId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/boulders/${boulderId}`);

  const file = formData.get("photo") as File | null;
  const validationError = validatePhotoFile(file as File);
  if (validationError) {
    return { error: validationError };
  }

  const { count } = await supabase
    .from("boulder_photos")
    .select("*", { count: "exact", head: true })
    .eq("boulder_id", boulderId);

  const isFirstPhoto = (count ?? 0) === 0;

  const result = await uploadPhotosForBoulder(
    supabase,
    user.id,
    boulderId,
    [file as File],
    isFirstPhoto ? 0 : -1
  );

  if (result.error) return { error: result.error };

  revalidatePath(`/boulders/${boulderId}`);
  return { success: true };
}
