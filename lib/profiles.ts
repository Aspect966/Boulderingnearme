import type { SupabaseClient } from "@supabase/supabase-js";
import type { FriendProfile, Friendship, Profile, ProfileStats } from "@/lib/types";

export async function getProfileStats(
  supabase: SupabaseClient,
  profileId: string
): Promise<ProfileStats> {
  const [boulders, comments, ratings, friends] = await Promise.all([
    supabase
      .from("boulders")
      .select("*", { count: "exact", head: true })
      .eq("created_by", profileId),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
    supabase
      .from("difficulty_ratings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
    supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`),
  ]);

  return {
    boulders: boulders.count ?? 0,
    comments: comments.count ?? 0,
    ratings: ratings.count ?? 0,
    friends: friends.count ?? 0,
  };
}

export async function getFriendshipBetween(
  supabase: SupabaseClient,
  userId: string,
  profileId: string
): Promise<Friendship | null> {
  const { data } = await supabase
    .from("friendships")
    .select("*")
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${profileId}),and(requester_id.eq.${profileId},addressee_id.eq.${userId})`
    )
    .maybeSingle();

  return data;
}

export async function getProfileFriends(
  supabase: SupabaseClient,
  profileId: string
): Promise<FriendProfile[]> {
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`);

  if (!friendships?.length) return [];

  const friendIds = friendships.map((f) =>
    f.requester_id === profileId ? f.addressee_id : f.requester_id
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_path, bio")
    .in("id", friendIds);

  return profiles ?? [];
}

export type ProfileRow = Profile;
