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
import { uploadProfileImage, validateProfileImage } from "@/lib/profile-images";
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

  // Each section has its own pending + feedback state so they don't block each other
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profilePending, startProfileTransition] = useTransition();

  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [avatarPending, startAvatarTransition] = useTransition();

  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [backgroundSuccess, setBackgroundSuccess] = useState<string | null>(null);
  const [backgroundPending, startBackgroundTransition] = useTransition();

  // Cache-bust versions — set to Date.now() after a successful upload so the
  // browser fetches the new file even though the storage path stays the same.
  const [avatarVersion, setAvatarVersion] = useState<number | null>(null);
  const [backgroundVersion, setBackgroundVersion] = useState<number | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const rawAvatarUrl = getProfileAssetUrl(profile.avatar_path);
  const rawBackgroundUrl = getProfileAssetUrl(profile.background_path);

  const avatarUrl = rawAvatarUrl
    ? avatarVersion
      ? `${rawAvatarUrl}?v=${avatarVersion}`
      : rawAvatarUrl
    : null;

  const backgroundUrl = rawBackgroundUrl
    ? backgroundVersion
      ? `${rawBackgroundUrl}?v=${backgroundVersion}`
      : rawBackgroundUrl
    : null;

  // ── Profile text ──────────────────────────────────────────────────────────

  function handleProfileSubmit(formData: FormData) {
    setProfileError(null);
    setProfileSuccess(null);
    startProfileTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) setProfileError(result.error);
      else setProfileSuccess("Profile updated.");
    });
  }

  // ── Shared upload helper ──────────────────────────────────────────────────

  async function uploadAsset(
    file: File,
    kind: "avatar" | "background"
  ): Promise<{ error?: string }> {
    const validationError = validateProfileImage(file);
    if (validationError) return { error: validationError };

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

  // ── Avatar ────────────────────────────────────────────────────────────────

  function handleAvatarSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAvatarError(null);
    setAvatarSuccess(null);

    const file = avatarInputRef.current?.files?.[0];
    if (!file) {
      setAvatarError("Please choose an image.");
      return;
    }

    startAvatarTransition(async () => {
      try {
        const result = await uploadAsset(file, "avatar");
        if (result.error) {
          setAvatarError(result.error);
          return;
        }
        setAvatarSuccess("Photo updated.");
        setAvatarVersion(Date.now());
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        router.refresh();
      } catch {
        setAvatarError("Something went wrong. Please try again.");
      }
    });
  }

  // ── Background ────────────────────────────────────────────────────────────

  function handleBackgroundSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBackgroundError(null);
    setBackgroundSuccess(null);

    const file = backgroundInputRef.current?.files?.[0];
    if (!file) {
      setBackgroundError("Please choose an image.");
      return;
    }

    startBackgroundTransition(async () => {
      try {
        const result = await uploadAsset(file, "background");
        if (result.error) {
          setBackgroundError(result.error);
          return;
        }
        setBackgroundSuccess("Background updated.");
        setBackgroundVersion(Date.now());
        if (backgroundInputRef.current) backgroundInputRef.current.value = "";
        router.refresh();
      } catch {
        setBackgroundError("Something went wrong. Please try again.");
      }
    });
  }

  function handleRemoveBackground() {
    setBackgroundError(null);
    setBackgroundSuccess(null);
    startBackgroundTransition(async () => {
      try {
        const result = await removeProfileBackground();
        if (result?.error) setBackgroundError(result.error);
        else {
        setBackgroundSuccess("Background removed.");
        setBackgroundVersion(null);
        router.refresh();
        }
      } catch {
        setBackgroundError("Something went wrong. Please try again.");
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

      {/* Cover image */}
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
          <form onSubmit={handleBackgroundSubmit} className="flex flex-wrap items-center gap-3">
            <input
              ref={backgroundInputRef}
              type="file"
              name="background"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
            />
            <Button type="submit" size="sm" disabled={backgroundPending}>
              {backgroundPending ? "Uploading…" : "Upload background"}
            </Button>
            {backgroundUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={backgroundPending}
                onClick={handleRemoveBackground}
              >
                Remove
              </Button>
            )}
          </form>
          <p className="text-xs text-stone-400">JPEG, PNG, WebP or GIF · max 30 MB</p>
          {backgroundError && <p className="text-sm text-red-600">{backgroundError}</p>}
          {backgroundSuccess && <p className="text-sm text-green-700">{backgroundSuccess}</p>}
        </CardContent>
      </Card>

      {/* Profile photo */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900">Profile photo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
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
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium"
              />
              <Button type="submit" size="sm" disabled={avatarPending}>
                {avatarPending ? "Uploading…" : "Upload photo"}
              </Button>
            </form>
          </div>
          <p className="text-xs text-stone-400">JPEG, PNG, WebP or GIF · max 30 MB</p>
          {avatarError && <p className="text-sm text-red-600">{avatarError}</p>}
          {avatarSuccess && <p className="text-sm text-green-700">{avatarSuccess}</p>}
        </CardContent>
      </Card>

      {/* About you */}
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
                placeholder="Tell climbers about your style, home crag, or favorite sends…"
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
              <Button type="submit" disabled={profilePending}>
                {profilePending ? "Saving…" : "Save profile"}
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
