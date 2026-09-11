"use client";

import { useEffect, useState } from "react";
import { ADS_ENABLED, ADS_LABEL, SPONSORS, type Sponsor } from "@/lib/sponsors";

/**
 * A small advertisement pinned to the bottom corner of the board.
 * It is styled as another sheet of paper so it belongs on the noticeboard,
 * and it is labelled and dismissible so it never behaves like a dark pattern.
 */
export function SponsorCorner() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [closed, setClosed] = useState(false);

  // Chosen after mount so that server and browser markup always agree.
  useEffect(() => {
    if (!ADS_ENABLED || SPONSORS.length === 0) return;
    setSponsor(SPONSORS[Math.floor(Math.random() * SPONSORS.length)]);
  }, []);

  if (!sponsor || closed) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="pointer-events-none fixed bottom-4 right-4 z-30 hidden w-[212px] md:block"
    >
      <div className="pointer-events-auto relative">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-faint ring-4 ring-board"
        />

        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Hide this advertisement"
          className="absolute -right-2 -top-2 z-20 grid h-6 w-6 place-items-center rounded-full border border-board-line bg-white text-ink-soft shadow-pin transition-colors hover:text-ink"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <a
          href={sponsor.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="sheet block overflow-hidden transition-shadow hover:shadow-lift"
        >
          <p className="px-3 pt-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            {ADS_LABEL}
          </p>

          <div className="flex items-center justify-center bg-[#0d0d0d] px-3 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="h-auto w-full max-w-[170px]"
              loading="lazy"
            />
          </div>

          <div className="px-3 pb-3 pt-2.5">
            <p className="text-[13px] font-semibold leading-tight">
              {sponsor.name}
            </p>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">
              {sponsor.tagline}
            </p>
          </div>
        </a>
      </div>
    </aside>
  );
}

/**
 * The same advertisement as a normal block, used inside the footer so that
 * phone users still see it without anything floating over their screen.
 */
export function SponsorFooterSlot() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    if (!ADS_ENABLED || SPONSORS.length === 0) return;
    setSponsor(SPONSORS[Math.floor(Math.random() * SPONSORS.length)]);
  }, []);

  if (!sponsor) return null;

  return (
    <div className="md:hidden">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
        {ADS_LABEL}
      </p>
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="sheet inline-flex max-w-[240px] items-center gap-3 overflow-hidden p-2.5"
      >
        <span className="flex shrink-0 items-center rounded-[2px] bg-[#0d0d0d] px-2 py-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sponsor.image}
            alt={sponsor.name}
            className="h-auto w-[104px]"
            loading="lazy"
          />
        </span>
        <span className="text-[12px] leading-snug text-ink-soft">
          {sponsor.tagline}
        </span>
      </a>
    </div>
  );
}
