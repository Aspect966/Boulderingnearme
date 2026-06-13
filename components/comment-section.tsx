"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Comment } from "@/lib/types";

export function CommentSection({
  boulderId,
  comments,
  isLoggedIn,
}: {
  boulderId: string;
  comments: Comment[];
  isLoggedIn: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addComment(boulderId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-stone-900">Comments</h2>
        <p className="text-sm text-stone-600">
          Beta, conditions, parking tips, and send stories.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm text-stone-500">No comments yet. Start the conversation.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/profile/${comment.user_id}`}
                    className="text-sm font-semibold text-stone-800 hover:text-amber-700"
                  >
                    {comment.profiles?.display_name ?? "Climber"}
                  </Link>
                  <time className="text-xs text-stone-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {comment.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        {isLoggedIn ? (
          <form action={handleSubmit} className="space-y-3">
            <Textarea
              name="content"
              placeholder="Share beta, conditions, or approach notes..."
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={pending}>
              {pending ? "Posting..." : "Post comment"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-stone-500">Log in to leave a comment.</p>
        )}
      </CardContent>
    </Card>
  );
}
