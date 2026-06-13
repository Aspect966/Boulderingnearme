import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FriendRequestsPanel } from "@/components/friend-requests-panel";
import { FriendsList } from "@/components/friends-list";
import { getProfileFriends } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Friends",
};

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/friends");
  }

  const [friends, incomingRows, outgoingRows] = await Promise.all([
    getProfileFriends(supabase, user.id),
    supabase
      .from("friendships")
      .select("id, created_at, requester_id")
      .eq("addressee_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("friendships")
      .select("id, created_at, addressee_id")
      .eq("requester_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  const profileIds = [
    ...(incomingRows.data ?? []).map((row) => row.requester_id),
    ...(outgoingRows.data ?? []).map((row) => row.addressee_id),
  ];

  const { data: requestProfiles } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, avatar_path")
        .in("id", profileIds)
    : { data: [] as { id: string; display_name: string | null; avatar_path: string | null }[] };

  const profileMap = new Map((requestProfiles ?? []).map((profile) => [profile.id, profile]));

  const incoming = (incomingRows.data ?? []).map((row) => ({
    id: row.id,
    created_at: row.created_at,
    profile: profileMap.get(row.requester_id) ?? {
      id: row.requester_id,
      display_name: null,
      avatar_path: null,
    },
  }));

  const outgoing = (outgoingRows.data ?? []).map((row) => ({
    id: row.id,
    created_at: row.created_at,
    profile: profileMap.get(row.addressee_id) ?? {
      id: row.addressee_id,
      display_name: null,
      avatar_path: null,
    },
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Friends</h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage friend requests and see who you are connected with.
        </p>
      </div>

      <FriendRequestsPanel incoming={incoming} outgoing={outgoing} />
      <FriendsList friends={friends} title="Your friends" />
    </div>
  );
}
