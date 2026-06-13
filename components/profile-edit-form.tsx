"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  removeProfileBackground,
  saveProfileAvatarPath,
  saveProfileBackgroundPath,
  updateProfile,
} from "@/app/actions/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadProfileImage } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/client";
import { getProfileAssetUrl } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export function ProfileEditForm({
  profile,
  showWelcome,
}: {
  profile: Profile;
  showWelcome?: boolean;
}) {
  const router = useRouter();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [backgroundSuccess, setBackgroundSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = getProfileAssetUrl(profile.avatar_path);
  const backgroundUrl = getProfileAssetUrl(profile.background_path);

  function handleProfileSubmit(formData: FormData) {
    setProfileError(null);
    setProfileSuccess(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) setProfileError(result.error);
      else setProfileSuccess("Profile updated.");
    });
  }

  async function uploadAsset(
    file: File,
    kind: "avatar" | "background"
  ): Promise<{ error?: string }> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to upload images." };
    }

    const result = await uploadProfileImage(supabase, user.id, file, kind);
    if (result.error || !result.path) {
      return { error: result.error ?? "Upload failed." };
    }

    const saveResult =
      kind === "avatar"
        ? await saveProfileAvatarPath(result.path)
        : await saveProfileBackgroundPath(result.path);

    if (saveResult?.error) {
      return { error: saveResult.error };
    }

    return {};
  }

  function handleAvatarSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAvatarError(null);
    setAvatarSuccess(null);

    const file = avatarInputRef.current?.files?.[0];
    if (!file) {
      setAvatarError("Please choose an image.");
      return;
    }

    startTransition(async () => {
      const result = await uploadAsset(file, "avatar");
      if (result.error) {
        setAvatarError(result.error);
        return;
      }

      setAvatarSuccess("Avatar updated.");
      avatarInputRef.current && (avatarInputRef.current.value = "");
      router.refresh();
    });
  }

  function handleBackgroundSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBackgroundError(null);
    setBackgroundSuccess(null);

    const file = backgroundInputRef.current?.files?.[0];
    if (!file) {
      setBackgroundError("Please choose an image.");
      return;
    }

    startTransition(async () => {
      const result = await uploadAsset(file, "background");
      if (result.error) {
        setBackgroundError(result.error);
        return;
      }

      setBackgroundSuccess("Background updated.");
      backgroundInputRef.current && (backgroundInputRef.current.value = "");
      router.refresh();
    });
  }

  function handleRemoveBackground() {
    setBackgroundError(null);
    setBackgroundSuccess(null);
    startTransition(async () => {
      const result = await removeProfileBackground();
      if (result?.error) setBackgroundError(result.error);
      else {
        setBackgroundSuccess("Background removed.");
        router.refresh();
      }
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
          <form
            onSubmit={handleBackgroundSubmit}
            className="flex flex-wrap items-center gap-3"
          >
            <input
              ref={backgroundInputRef}
              type="file"
              name="background"
              accept="image/*"
              className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
            />
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Uploading..." : "Upload background"}
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
          {backgroundError && <p className="text-sm text-red-600">{backgroundError}</p>}
          {backgroundSuccess && (
            <p className="text-sm text-green-700">{backgroundSuccess}</p>
          )}
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
            <form onSubmit={handleAvatarSubmit} className="flex flex-wrap items-center gap-3">
              <input
                ref={avatarInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
              />
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Uploading..." : "Upload photo"}
              </Button>
            </form>
          </div>
          {avatarError && <p className="text-sm text-red-600">{avatarError}</p>}
          {avatarSuccess && <p className="text-sm text-green-700">{avatarSuccess}</p>}
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
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-green-700">{profileSuccess}</p>}
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
