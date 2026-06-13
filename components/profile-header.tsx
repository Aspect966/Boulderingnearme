import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getProfileAssetUrl } from "@/lib/storage";
import type { ProfileStats } from "@/lib/types";

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-xl font-bold text-stone-900">{value}</p>
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

export function ProfileHeader({
  profile,
  stats,
  isOwnProfile,
  actions,
}: {
  profile: {
    id: string;
    display_name: string | null;
    bio: string | null;
    avatar_path: string | null;
    background_path: string | null;
    location: string | null;
    website: string | null;
    role: "user" | "owner";
    created_at: string;
  };
  stats: ProfileStats;
  isOwnProfile: boolean;
  actions?: React.ReactNode;
}) {
  const backgroundUrl = getProfileAssetUrl(profile.background_path);
  const avatarUrl = getProfileAssetUrl(profile.avatar_path);
  const displayName = profile.display_name ?? "Climber";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative h-44 sm:h-56">
        {backgroundUrl ? (
          <Image
            src={backgroundUrl}
            alt={`${displayName}'s profile background`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-amber-500 via-amber-600 to-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="relative px-4 pb-6 sm:px-6">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-stone-200 shadow-lg sm:h-32 sm:w-32">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-900 text-2xl font-bold text-amber-400">
                  {initials}
                </div>
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                  {displayName}
                </h1>
                {profile.role === "owner" && <Badge>Owner</Badge>}
              </div>
              {profile.location && (
                <p className="mt-1 text-sm text-stone-600">{profile.location}</p>
              )}
              <p className="mt-1 text-xs text-stone-400">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="inline-flex h-9 items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
              >
                Edit profile
              </Link>
            )}
            {actions}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-700">
            {profile.bio}
          </p>
        )}

        {profile.website && (
          <a
            href={
              profile.website.startsWith("http")
                ? profile.website
                : `https://${profile.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
          >
            {profile.website.replace(/^https?:\/\//, "")}
          </a>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-100 pt-5 sm:grid-cols-4">
          <StatItem label="Boulders" value={stats.boulders} />
          <StatItem label="Comments" value={stats.comments} />
          <StatItem label="Ratings" value={stats.ratings} />
          <StatItem label="Friends" value={stats.friends} />
        </div>
      </div>
    </div>
  );
}
