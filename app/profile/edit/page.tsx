import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Profile",
};

type PageProps = {
  searchParams: Promise<{ welcome?: string }>;
};

export default async function ProfileEditPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/profile/edit");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login?next=/profile/edit");
  }

  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Edit profile</h1>
        <p className="mt-1 text-sm text-stone-600">
          Customize how other climbers see you on BoulderingNearMe.
        </p>
      </div>
      <ProfileEditForm profile={profile} showWelcome={params.welcome === "1"} />
    </div>
  );
}
