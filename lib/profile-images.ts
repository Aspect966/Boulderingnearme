export const MAX_PROFILE_IMAGE_BYTES = 30 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function fileExtension(file: File): string {
  return (file.name.split(".").pop() ?? "").toLowerCase();
}

export function validateProfileImage(file: File): string | null {
  if (!file || file.size === 0) {
    return "Please choose an image to upload.";
  }

  const ext = fileExtension(file);

  if (ext === "heic" || ext === "heif") {
    return "HEIC photos aren't supported. On iPhone, tap Share → Save as JPEG, then try again.";
  }

  // iOS sometimes reports an empty MIME type — fall back to extension check
  const mimeOk = file.type === "" || file.type.startsWith("image/");
  if (!mimeOk || !ALLOWED_EXTENSIONS.has(ext)) {
    return "Only JPEG, PNG, WebP, or GIF images are allowed.";
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return "Image must be under 30 MB.";
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

  const ext = fileExtension(file) || "jpg";
  const path = `${userId}/${kind}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-assets")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  return { path };
}
