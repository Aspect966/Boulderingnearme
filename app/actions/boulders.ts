"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCoordinate } from "@/lib/geo";
import { getGradeOption } from "@/lib/grades";
import type { GradeScale } from "@/lib/grades";
import { MAX_BOULDER_PHOTOS, removeStoragePaths, uploadPhotosForBoulder, validatePhotoFile } from "@/lib/photos";
import { canDeleteBoulder, getUserRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

export async function createBoulder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/boulders/new");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const latitude = parseCoordinate(String(formData.get("latitude") ?? ""));
  const longitude = parseCoordinate(String(formData.get("longitude") ?? ""));
  const primaryScale = String(formData.get("primary_scale") ?? "v_scale") as GradeScale;
  const initialGradeLabel = String(formData.get("initial_grade") ?? "").trim();

  if (!name || !locationLabel) {
    return { error: "Please fill in all required fields." };
  }

  if (latitude === null || longitude === null) {
    return {
      error:
        'Enter valid GPS coordinates (decimal like 60.423889 or DMS like 60°25\'26"N).',
    };
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { error: "GPS coordinates are out of range." };
  }

  const photoFiles = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (photoFiles.length > MAX_BOULDER_PHOTOS) {
    return { error: `You can add up to ${MAX_BOULDER_PHOTOS} photos.` };
  }

  let thumbnailIndex = Number(formData.get("thumbnail_index") ?? 0);
  if (photoFiles.length > 0) {
    if (
      Number.isNaN(thumbnailIndex) ||
      thumbnailIndex < 0 ||
      thumbnailIndex >= photoFiles.length
    ) {
      thumbnailIndex = 0;
    }

    for (const file of photoFiles) {
      const photoError = validatePhotoFile(file);
      if (photoError) return { error: photoError };
    }
  }

  const { data: boulder, error } = await supabase
    .from("boulders")
    .insert({
      name,
      description: description || null,
      location_label: locationLabel,
      latitude,
      longitude,
      primary_scale: primaryScale,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !boulder) {
    return { error: error?.message ?? "Failed to create boulder." };
  }

  if (initialGradeLabel) {
    const grade = getGradeOption(primaryScale, initialGradeLabel);
    if (grade) {
      await supabase.from("difficulty_ratings").insert({
        boulder_id: boulder.id,
        user_id: user.id,
        scale: primaryScale,
        grade_label: grade.label,
        v_equivalent: grade.vEquivalent,
      });
    }
  }

  if (photoFiles.length > 0) {
    const uploadResult = await uploadPhotosForBoulder(
      supabase,
      user.id,
      boulder.id,
      photoFiles,
      thumbnailIndex
    );

    if (uploadResult.error) {
      return { error: uploadResult.error };
    }
  }

  revalidatePath("/");
  revalidatePath(`/boulders/${boulder.id}`);
  redirect(`/boulders/${boulder.id}`);
}

export async function updateBoulder(boulderId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();

  const { error } = await supabase
    .from("boulders")
    .update({
      name,
      description: description || null,
      location_label: locationLabel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", boulderId)
    .eq("created_by", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/boulders/${boulderId}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteBoulder(boulderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/boulders/${boulderId}`);

  const { data: boulder, error: fetchError } = await supabase
    .from("boulders")
    .select("id, created_by, boulder_photos(storage_path)")
    .eq("id", boulderId)
    .single();

  if (fetchError || !boulder) {
    return { error: "Boulder not found." };
  }

  const role = await getUserRole(supabase, user.id);
  if (!canDeleteBoulder(user.id, boulder.created_by, role)) {
    return { error: "You don't have permission to delete this listing." };
  }

  const storagePaths = (boulder.boulder_photos ?? []).map(
    (photo: { storage_path: string }) => photo.storage_path
  );

  if (storagePaths.length > 0) {
    await removeStoragePaths(supabase, storagePaths);
  }

  const { error } = await supabase.from("boulders").delete().eq("id", boulderId);

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}
