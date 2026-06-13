"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MAX_BOULDER_PHOTOS, uploadPhotosForBoulder, validatePhotoFile } from "@/lib/photos";
import { createClient } from "@/lib/supabase/server";

export async function uploadBoulderPhoto(boulderId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/boulders/${boulderId}`);

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Please choose a photo." };

  const validationError = validatePhotoFile(file);
  if (validationError) return { error: validationError };

  const { count } = await supabase
    .from("boulder_photos")
    .select("*", { count: "exact", head: true })
    .eq("boulder_id", boulderId);

  const currentCount = count ?? 0;
  if (currentCount >= MAX_BOULDER_PHOTOS) {
    return { error: `This boulder already has ${MAX_BOULDER_PHOTOS} photos, which is the maximum.` };
  }

  const isFirstPhoto = currentCount === 0;

  const result = await uploadPhotosForBoulder(
    supabase,
    user.id,
    boulderId,
    [file],
    isFirstPhoto ? 0 : -1
  );

  if (result.error) return { error: result.error };

  revalidatePath(`/boulders/${boulderId}`);
  return { success: true };
}
