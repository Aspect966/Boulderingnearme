import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoulderDeleteButton } from "@/components/boulder-delete-button";
import { CommentSection } from "@/components/comment-section";
import { DifficultyRatingForm } from "@/components/difficulty-rating-form";
import { PhotoGallery } from "@/components/photo-gallery";
import { PhotoUploadForm } from "@/components/photo-upload-form";
import { Badge } from "@/components/ui/badge";
import { formatConsensusGrade, getScaleDefinition } from "@/lib/grades";
import { mapsUrl } from "@/lib/geo";
import { canDeleteBoulder, getUserRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import type { GradeScale } from "@/lib/grades";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("boulders").select("name").eq("id", id).single();
  return { title: data?.name ?? "Boulder" };
}

export default async function BoulderPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: boulder, error } = await supabase
    .from("boulders")
    .select(
      "*, boulder_photos(*), difficulty_ratings(*), comments(*, profiles(display_name))"
    )
    .eq("id", id)
    .single();

  if (error || !boulder) notFound();

  const role = user ? await getUserRole(supabase, user.id) : null;
  const showDeleteButton = user
    ? canDeleteBoulder(user.id, boulder.created_by, role)
    : false;

  const grade = formatConsensusGrade(
    boulder.consensus_v_grade,
    boulder.primary_scale as GradeScale
  );
  const scaleName = getScaleDefinition(boulder.primary_scale as GradeScale).name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="accent">{grade}</Badge>
          <Badge>{scaleName}</Badge>
          <Badge tone="neutral">{boulder.location_label}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{boulder.name}</h1>
        {boulder.description && (
          <p className="max-w-3xl text-lg leading-relaxed text-stone-600">
            {boulder.description}
          </p>
        )}
        <a
          href={mapsUrl(boulder.latitude, boulder.longitude, boulder.location_label)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          Open in Google Maps →
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <PhotoGallery photos={boulder.boulder_photos ?? []} />
          <DifficultyRatingForm
            boulderId={boulder.id}
            primaryScale={boulder.primary_scale as GradeScale}
            consensusVGrade={boulder.consensus_v_grade}
            ratings={boulder.difficulty_ratings ?? []}
            isLoggedIn={!!user}
          />
          <CommentSection
            boulderId={boulder.id}
            comments={boulder.comments ?? []}
            isLoggedIn={!!user}
          />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Location
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">Area</dt>
                <dd className="font-medium text-stone-900">{boulder.location_label}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Coordinates</dt>
                <dd className="font-mono text-stone-800">
                  {boulder.latitude.toFixed(5)}, {boulder.longitude.toFixed(5)}
                </dd>
              </div>
            </dl>
          </div>

          {user && <PhotoUploadForm boulderId={boulder.id} />}

          {showDeleteButton && (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Manage listing
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                {boulder.created_by === user?.id
                  ? "You created this listing."
                  : "Owner access — you can remove any listing."}
              </p>
              <div className="mt-4">
                <BoulderDeleteButton boulderId={boulder.id} boulderName={boulder.name} />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
