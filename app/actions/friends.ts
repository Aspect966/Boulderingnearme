"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateFriendPaths(profileId: string) {
  revalidatePath(`/profile/${profileId}`);
  revalidatePath("/friends");
}

export async function sendFriendRequest(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/profile/${profileId}`);

  if (user.id === profileId) {
    return { error: "You cannot add yourself as a friend." };
  }

  const { data: existing } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${profileId}),and(requester_id.eq.${profileId},addressee_id.eq.${user.id})`
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === "accepted") {
      return { error: "You are already friends." };
    }
    if (existing.requester_id === user.id) {
      return { error: "Friend request already sent." };
    }
    return { error: "This user has already sent you a request. Check your friends page." };
  }

  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: profileId,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidateFriendPaths(profileId);
  revalidateFriendPaths(user.id);
  return { success: true };
}

export async function acceptFriendRequest(friendshipId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/friends");

  const { data: friendship, error: fetchError } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .eq("id", friendshipId)
    .single();

  if (fetchError || !friendship) {
    return { error: "Friend request not found." };
  }

  if (friendship.addressee_id !== user.id) {
    return { error: "You cannot accept this request." };
  }

  if (friendship.status !== "pending") {
    return { error: "This request is no longer pending." };
  }

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", friendshipId);

  if (error) return { error: error.message };

  revalidateFriendPaths(friendship.requester_id);
  revalidateFriendPaths(friendship.addressee_id);
  return { success: true };
}

export async function declineFriendRequest(friendshipId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/friends");

  const { data: friendship } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id")
    .eq("id", friendshipId)
    .single();

  if (!friendship) return { error: "Friend request not found." };

  if (friendship.addressee_id !== user.id && friendship.requester_id !== user.id) {
    return { error: "You cannot remove this request." };
  }

  const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);

  if (error) return { error: error.message };

  revalidateFriendPaths(friendship.requester_id);
  revalidateFriendPaths(friendship.addressee_id);
  return { success: true };
}

export async function removeFriend(friendshipId: string) {
  return declineFriendRequest(friendshipId);
}
