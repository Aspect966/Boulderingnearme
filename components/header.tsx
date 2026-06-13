import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <MobileNav userId={user?.id ?? null} />
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-lg font-bold text-amber-400 shadow-sm">
              B
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-stone-900 group-hover:text-amber-700">
                BoulderingNearMe
              </p>
              <p className="hidden text-xs text-stone-500 sm:block">
                Outdoor boulders, community grades
              </p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 sm:flex sm:gap-3">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Explore
          </Link>
          {user ? (
            <>
              <Link
                href={`/profile/${user.id}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Profile
              </Link>
              <Link
                href="/friends"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Friends
              </Link>
              <Link href="/boulders/new">
                <Button size="sm">Add Boulder</Button>
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
