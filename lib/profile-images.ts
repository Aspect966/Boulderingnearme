export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateProfileImage(file: File): string | null {
  if (!file || file.size === 0) {
    return "Please choose an image to upload.";
  }

  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return "Image must be under 5 MB.";
  }

  return null;
}

export async function uploadProfileImage(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
  file: File,
  kind: "avatar" | "background"
): Promise<{ path?: string; error?: string }> {
  const validationError = validateProfileImage(file);
  if (validationError) return { error: validationError };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${kind}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-assets")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  return { path };
}
