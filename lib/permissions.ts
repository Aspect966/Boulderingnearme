import type { SupabaseClient } from "@supabase/supabase-js";

export function canDeleteBoulder(
  userId: string,
  createdBy: string | null,
  role: string | null | undefined
): boolean {
  return createdBy === userId || role === "owner";
}

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role ?? null;
}
