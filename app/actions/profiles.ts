"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadProfileImage } from "@/lib/profile-images";
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
  path: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  if (!isOwnProfileAssetPath(user.id, path, kind)) {
    return { error: "Invalid image path." };
  }

  const column = kind === "avatar" ? "avatar_path" : "background_path";
  const { error } = await supabase
    .from("profiles")
    .update({ [column]: path })
    .eq("id", user.id);

  if (error) return { error: error.message };

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

export async function uploadProfileAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "Please choose an image." };

  const result = await uploadProfileImage(supabase, user.id, file, "avatar");
  if (result.error) return { error: result.error };

  return saveProfileAvatarPath(result.path!);
}

export async function uploadProfileBackground(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/profile/edit");

  const file = formData.get("background") as File | null;
  if (!file || file.size === 0) return { error: "Please choose an image." };

  const result = await uploadProfileImage(supabase, user.id, file, "background");
  if (result.error) return { error: result.error };

  return saveProfileBackgroundPath(result.path!);
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

  if (profile?.background_path) {
    await supabase.storage.from("profile-assets").remove([profile.background_path]);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ background_path: null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/profile/edit");
  return { success: true };
}
