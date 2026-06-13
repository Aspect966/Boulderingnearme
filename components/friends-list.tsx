import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getProfileAssetUrl } from "@/lib/storage";
import type { FriendProfile } from "@/lib/types";

function FriendCard({ friend }: { friend: FriendProfile }) {
  const avatarUrl = getProfileAssetUrl(friend.avatar_path);
  const name = friend.display_name ?? "Climber";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/profile/${friend.id}`}
      className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 transition hover:border-amber-200 hover:bg-amber-50/50"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-200">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-900 text-sm font-bold text-amber-400">
            {initials}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-stone-900">{name}</p>
        {friend.bio && (
          <p className="truncate text-sm text-stone-500">{friend.bio}</p>
        )}
      </div>
    </Link>
  );
}

export function FriendsList({
  friends,
  title = "Friends",
}: {
  friends: FriendProfile[];
  title?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
        <p className="text-sm text-stone-600">
          {friends.length === 0
            ? "No friends to show yet."
            : `${friends.length} climber${friends.length === 1 ? "" : "s"}`}
        </p>
      </CardHeader>
      <CardContent>
        {friends.length === 0 ? (
          <p className="text-sm text-stone-500">
            Visit other profiles and send friend requests to build your network.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {friends.map((friend) => (
              <li key={friend.id}>
                <FriendCard friend={friend} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
