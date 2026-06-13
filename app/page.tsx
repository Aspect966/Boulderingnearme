import Link from "next/link";
import { NearMeSection } from "@/components/near-me-section";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: boulders } = await supabase
    .from("boulders")
    .select("*, boulder_photos(*)")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,119,6,0.25),_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Outdoor bouldering, mapped
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find boulders near you. Share the send.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-stone-300">
              Discover outdoor problems, add new boulders with photos and locations,
              and let the community build consensus grades across V-Scale, Font,
              British, Japanese, and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/boulders/new">
                <Button size="lg">Add a boulder</Button>
              </Link>
              <a href="#explore">
                <Button size="lg" variant="outline" className="border-stone-600 bg-transparent text-white hover:bg-white/10">
                  Explore nearby
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <NearMeSection boulders={boulders ?? []} />
      </section>
    </>
  );
}
