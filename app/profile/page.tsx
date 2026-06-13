import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/profile");
  }

  redirect(`/profile/${user.id}`);
}
