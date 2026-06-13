import type { SupabaseClient } from "@supabase/supabase-js";
import type { BoulderPhoto } from "@/lib/types";

export const MAX_BOULDER_PHOTOS = 10;
export const MAX_PHOTO_BYTES = 30 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export function validatePhotoFile(file: File): string | null {
  if (!file || file.size === 0) {
    return "Please choose a photo to upload.";
  }

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();

  if (ext === "heic" || ext === "heif") {
    return "HEIC photos aren't supported. On iPhone, tap Share → Save as JPEG, then try again.";
  }

  // iOS sometimes reports an empty MIME type — fall back to extension check
  const mimeOk = file.type === "" || file.type.startsWith("image/");
  if (!mimeOk || !ALLOWED_EXTENSIONS.has(ext)) {
    return "Only JPEG, PNG, WebP, or GIF images are allowed.";
  }

  if (file.size > MAX_PHOTO_BYTES) {
    return "Each photo must be under 30 MB.";
  }

  return null;
}

export async function removeStoragePaths(
  supabase: SupabaseClient,
  paths: string[]
) {
  if (paths.length === 0) return;
  await supabase.storage.from("boulder-photos").remove(paths);
}

export async function uploadPhotosForBoulder(
  supabase: SupabaseClient,
  userId: string,
  boulderId: string,
  files: File[],
  thumbnailIndex: number
): Promise<{ error?: string }> {
  const uploadedPaths: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const validationError = validatePhotoFile(file);
    if (validationError) {
      await removeStoragePaths(supabase, uploadedPaths);
      return { error: validationError };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/${boulderId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("boulder-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      await removeStoragePaths(supabase, uploadedPaths);
      return { error: uploadError.message };
    }

    uploadedPaths.push(path);

    const { error: dbError } = await supabase.from("boulder_photos").insert({
      boulder_id: boulderId,
      storage_path: path,
      user_id: userId,
      is_thumbnail: index === thumbnailIndex,
    });

    if (dbError) {
      await removeStoragePaths(supabase, uploadedPaths);
      return { error: dbError.message };
    }
  }

  return {};
}

export function sortPhotosForDisplay(photos: BoulderPhoto[]): BoulderPhoto[] {
  return [...photos].sort((a, b) => {
    if (a.is_thumbnail && !b.is_thumbnail) return -1;
    if (!a.is_thumbnail && b.is_thumbnail) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

export function getCoverPhoto(photos: BoulderPhoto[]): BoulderPhoto | undefined {
  return photos.find((photo) => photo.is_thumbnail) ?? photos[0];
}
