"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "@/app/actions/friends";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getProfileAssetUrl } from "@/lib/storage";

type RequestProfile = {
  id: string;
  display_name: string | null;
  avatar_path: string | null;
};

type FriendRequest = {
  id: string;
  created_at: string;
  profile: RequestProfile;
};

function RequestRow({
  request,
  type,
}: {
  request: FriendRequest;
  type: "incoming" | "outgoing";
}) {
  const [pending, startTransition] = useTransition();
  const avatarUrl = getProfileAssetUrl(request.profile.avatar_path);
  const name = request.profile.display_name ?? "Climber";

  function run(action: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/profile/${request.profile.id}`} className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-stone-200">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-900 text-xs font-bold text-amber-400">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-stone-900">{name}</p>
          <p className="text-xs text-stone-400">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
      </Link>

      {type === "incoming" ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={pending}
            onClick={() => run(() => acceptFriendRequest(request.id))}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => run(() => declineFriendRequest(request.id))}
          >
            Decline
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => declineFriendRequest(request.id))}
        >
          Cancel
        </Button>
      )}
    </li>
  );
}

export function FriendRequestsPanel({
  incoming,
  outgoing,
}: {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Incoming requests</h2>
        </CardHeader>
        <CardContent>
          {incoming.length === 0 ? (
            <p className="text-sm text-stone-500">No pending requests.</p>
          ) : (
            <ul className="space-y-3">
              {incoming.map((request) => (
                <RequestRow key={request.id} request={request} type="incoming" />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Sent requests</h2>
        </CardHeader>
        <CardContent>
          {outgoing.length === 0 ? (
            <p className="text-sm text-stone-500">No pending outgoing requests.</p>
          ) : (
            <ul className="space-y-3">
              {outgoing.map((request) => (
                <RequestRow key={request.id} request={request} type="outgoing" />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
