function getPublicStorageUrl(bucket: string, storagePath: string): string {
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`;
}

export function getPhotoPublicUrl(storagePath: string): string {
  return getPublicStorageUrl("boulder-photos", storagePath);
}

export function getProfileAssetUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  return getPublicStorageUrl("profile-assets", storagePath);
}
