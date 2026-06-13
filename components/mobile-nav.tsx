"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/actions/auth";
import { CustomizationNavButton } from "@/components/customization-trigger";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  userId: string | null;
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

const linkClass =
  "block rounded-lg px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100";

export function MobileNav({ userId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-xl",
          "text-stone-700 hover:bg-stone-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        )}
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20"
            aria-hidden
            onClick={closeMenu}
          />
          <nav
            id="mobile-nav-menu"
            className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-stone-200 bg-white py-2 shadow-lg"
          >
            <Link href="/" className={linkClass} onClick={closeMenu}>
              Explore
            </Link>
            <CustomizationNavButton onOpen={closeMenu} />
            {userId ? (
              <>
                <Link
                  href={`/profile/${userId}`}
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/profile/edit"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Edit profile
                </Link>
                <Link href="/friends" className={linkClass} onClick={closeMenu}>
                  Friends
                </Link>
                <Link
                  href="/boulders/new"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Add Boulder
                </Link>
                <div className="my-1 border-t border-stone-100" />
                <form action={signOut}>
                  <button
                    type="submit"
                    className={cn(linkClass, "w-full text-left text-stone-500")}
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
