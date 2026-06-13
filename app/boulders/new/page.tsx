import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BoulderForm } from "@/components/boulder-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Add Boulder",
};

export default async function NewBoulderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/boulders/new");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <BoulderForm />
    </div>
  );
}
