import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FriendActionButton } from "@/components/friend-action-button";
import { FriendsList } from "@/components/friends-list";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getFriendshipBetween,
  getProfileFriends,
  getProfileStats,
} from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", id)
    .maybeSingle();

  const name = profile?.display_name ?? "Climber";
  return { title: `${name}'s Profile` };
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) {
    notFound();
  }

  const [stats, friends, friendship] = await Promise.all([
    getProfileStats(supabase, id),
    getProfileFriends(supabase, id),
    user ? getFriendshipBetween(supabase, user.id, id) : Promise.resolve(null),
  ]);

  const isOwnProfile = user?.id === id;

  const { data: recentBoulders } = await supabase
    .from("boulders")
    .select("id, name, location_label, consensus_v_grade, created_at")
    .eq("created_by", id)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <ProfileHeader
        profile={profile}
        stats={stats}
        isOwnProfile={isOwnProfile}
        actions={
          !isOwnProfile ? (
            <FriendActionButton
              profileId={id}
              currentUserId={user?.id ?? null}
              friendship={friendship}
              isLoggedIn={!!user}
            />
          ) : undefined
        }
      />

      <FriendsList friends={friends} />

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Boulders added</h2>
        </CardHeader>
        <CardContent>
          {!recentBoulders?.length ? (
            <p className="text-sm text-stone-500">No boulders added yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentBoulders.map((boulder) => (
                <li key={boulder.id}>
                  <Link
                    href={`/boulders/${boulder.id}`}
                    className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 hover:border-amber-200 hover:bg-amber-50/50"
                  >
                    <div>
                      <p className="font-medium text-stone-900">{boulder.name}</p>
                      <p className="text-sm text-stone-500">{boulder.location_label}</p>
                    </div>
                    {boulder.consensus_v_grade != null && (
                      <span className="text-sm font-semibold text-amber-700">
                        V{boulder.consensus_v_grade}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
