"use client";

import { useTransition } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/app/actions/friends";
import { Button } from "@/components/ui/button";
import type { Friendship } from "@/lib/types";

export function FriendActionButton({
  profileId,
  currentUserId,
  friendship,
  isLoggedIn,
}: {
  profileId: string;
  currentUserId: string | null;
  friendship: Friendship | null;
  isLoggedIn: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn || !currentUserId) {
    return (
      <Button size="sm" variant="outline" disabled>
        Log in to add friends
      </Button>
    );
  }

  if (currentUserId === profileId) {
    return null;
  }

  function run(action: () => Promise<{ error?: string; success?: boolean }>) {
    startTransition(async () => {
      await action();
    });
  }

  if (!friendship) {
    return (
      <Button
        size="sm"
        disabled={pending}
        onClick={() => run(() => sendFriendRequest(profileId))}
      >
        {pending ? "Sending..." : "Add friend"}
      </Button>
    );
  }

  if (friendship.status === "accepted") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => removeFriend(friendship.id))}
      >
        {pending ? "Removing..." : "Friends · Remove"}
      </Button>
    );
  }

  if (friendship.requester_id === currentUserId) {
    return (
      <Button size="sm" variant="outline" disabled>
        Request sent
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => run(() => acceptFriendRequest(friendship.id))}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run(() => declineFriendRequest(friendship.id))}
      >
        Decline
      </Button>
    </div>
  );
}
