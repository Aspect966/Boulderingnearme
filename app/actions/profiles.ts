"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!displayName) {
    return { error: "Display name is required." };
  }

  if (bio.length > 500) {
    return { error: "Bio must be 500 characters or fewer." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio: bio || null,
      location: location || null,
      website: website || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/profile/edit");
  return { success: true };
}

function isOwnProfileAssetPath(
  userId: string,
  path: string,
  kind: "avatar" | "background"
): boolean {
  const prefix = `${userId}/${kind}.`;
  return path.startsWith(prefix) && !path.includes("..");
}

async function saveProfileAssetPath(
  kind: "avatar" | "background",
  newPath: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  if (!isOwnProfileAssetPath(user.id, newPath, kind)) {
    return { error: "Invalid image path." };
  }

  const column = kind === "avatar" ? "avatar_path" : "background_path";

  // Fetch the current path so we can clean up the old file if the extension changed
  const { data: existing } = await supabase
    .from("profiles")
    .select(column)
    .eq("id", user.id)
    .single();

  const oldPath = (existing as Record<string, string | null> | null)?.[column] ?? null;

  const { error } = await supabase
    .from("profiles")
    .update({ [column]: newPath })
    .eq("id", user.id);

  if (error) {
    // DB save failed — roll back the just-uploaded storage object
    await supabase.storage.from("profile-assets").remove([newPath]);
    return { error: error.message };
  }

  // Delete the old file only when the path (i.e. extension) changed
  if (oldPath && oldPath !== newPath) {
    await supabase.storage.from("profile-assets").remove([oldPath]);
  }

  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/profile/edit");
  return { success: true };
}

export async function saveProfileAvatarPath(path: string) {
  return saveProfileAssetPath("avatar", path);
}

export async function saveProfileBackgroundPath(path: string) {
  return saveProfileAssetPath("background", path);
}

export async function removeProfileBackground() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  const { data: profile } = await supabase
    .from("profiles")
    .select("background_path")
    .eq("id", user.id)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ background_path: null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  if (profile?.background_path) {
    await supabase.storage.from("profile-assets").remove([profile.background_path]);
  }

  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/profile/edit");
  return { success: true };
}
