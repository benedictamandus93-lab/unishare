"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const SECTIONS = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/services", label: "Services" },
  { href: "/wanted", label: "Wanted" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, displayName, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // The menu should not stay open after moving to another page.
  useEffect(() => setOpen(false), [pathname]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-board-line bg-board/95 backdrop-blur">
      <div className="mx-auto flex max-w-wall items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-sheet bg-varsity text-[15px] font-bold text-white"
          >
            U
          </span>
          <span className="font-display text-[21px] font-bold tracking-tight">
            UniShare
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => {
            const active = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`rounded-sheet px-3 py-2 text-[15px] font-semibold transition-colors ${
                  active
                    ? "bg-white text-varsity shadow-pin"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {loading ? (
            <span className="text-[14px] text-ink-faint">Loading</span>
          ) : user ? (
            <>
              <Link href="/account" className="btn-quiet">
                {displayName}
              </Link>
              <button type="button" onClick={handleSignOut} className="btn-quiet">
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-quiet">
              Log in
            </Link>
          )}
          <Link href="/post" className="btn-primary">
            + Post listing
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
          className="btn-quiet ml-auto md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-board-line bg-board px-4 pb-4 pt-3 md:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-sheet border border-board-line bg-white px-3 py-3 text-center text-[15px] font-semibold"
              >
                {section.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <Link href="/post" className="btn-primary w-full">
              + Post listing
            </Link>
            {user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/account" className="btn-quiet w-full">
                  My account
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-quiet w-full"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-quiet w-full">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
