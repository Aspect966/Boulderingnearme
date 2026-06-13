"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  removeProfileBackground,
  updateProfile,
  uploadProfileAvatar,
  uploadProfileBackground,
} from "@/app/actions/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProfileAssetUrl } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export function ProfileEditForm({
  profile,
  showWelcome,
}: {
  profile: Profile;
  showWelcome?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const avatarUrl = getProfileAssetUrl(profile.avatar_path);
  const backgroundUrl = getProfileAssetUrl(profile.background_path);

  function handleProfileSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) setError(result.error);
      else setSuccess("Profile updated.");
    });
  }

  function handleAvatarSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await uploadProfileAvatar(formData);
      if (result?.error) setError(result.error);
      else setSuccess("Avatar updated.");
    });
  }

  function handleBackgroundSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await uploadProfileBackground(formData);
      if (result?.error) setError(result.error);
      else setSuccess("Background updated.");
    });
  }

  function handleRemoveBackground() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await removeProfileBackground();
      if (result?.error) setError(result.error);
      else setSuccess("Background removed.");
    });
  }

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Welcome! Set up your profile so other climbers can find and add you.
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Cover image</h2>
          <p className="text-sm text-stone-600">
            This banner appears at the top of your public profile.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-40 overflow-hidden rounded-xl border border-stone-200">
            {backgroundUrl ? (
              <Image
                src={backgroundUrl}
                alt="Profile background preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-500 to-stone-800 text-sm text-white/80">
                Default gradient background
              </div>
            )}
          </div>
          <form action={handleBackgroundSubmit} className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              name="background"
              accept="image/*"
              className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
            />
            <Button type="submit" size="sm" disabled={pending}>
              Upload background
            </Button>
            {backgroundUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={handleRemoveBackground}
              >
                Remove
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Profile photo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-400">
                  ?
                </div>
              )}
            </div>
            <form action={handleAvatarSubmit} className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
              />
              <Button type="submit" size="sm" disabled={pending}>
                Upload photo
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">About you</h2>
        </CardHeader>
        <CardContent>
          <form action={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Display name
              </label>
              <Input
                name="display_name"
                defaultValue={profile.display_name ?? ""}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Bio</label>
              <Textarea
                name="bio"
                defaultValue={profile.bio ?? ""}
                placeholder="Tell climbers about your style, home crag, or favorite sends..."
                maxLength={500}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Location
              </label>
              <Input
                name="location"
                defaultValue={profile.location ?? ""}
                placeholder="City, region, or home crag"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Website
              </label>
              <Input
                name="website"
                defaultValue={profile.website ?? ""}
                placeholder="instagram.com/you or yoursite.com"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save profile"}
              </Button>
              <Link href={`/profile/${profile.id}`}>
                <Button type="button" variant="outline">
                  View public profile
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
