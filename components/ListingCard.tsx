import Link from "next/link";
import { CATEGORY_STYLE } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import { formatPrice, subcategoryLabel, timeAgo } from "@/lib/utils";
import { PosterArt } from "./PosterArt";

export function ListingCard({ listing }: { listing: Listing }) {
  const style = CATEGORY_STYLE[listing.category];

  return (
    <article className="group relative">
      {/* The pin that holds the flyer to the board. */}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-0 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${style.dot} ring-4 ring-board`}
      />
      <Link
        href={`/listing/${listing.id}`}
        className="sheet flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lift"
      >
        <PosterArt
          title={listing.title}
          category={listing.category}
          subcategory={listing.subcategory}
          imageUrl={listing.image_url}
        />
        <span aria-hidden="true" className={`h-[3px] w-full ${style.rule}`} />

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-start justify-between gap-3">
            <span className={`tag ${style.tag}`}>{style.label}</span>
            <span className="text-[12px] text-ink-faint">
              {timeAgo(listing.created_at)}
            </span>
          </div>

          <h3 className="font-display text-[19px] font-semibold leading-tight">
            {listing.title}
          </h3>

          <p className="text-[17px] font-semibold text-varsity">
            {formatPrice(listing.price, listing.price_unit)}
          </p>

          <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-soft">
            {listing.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-board-line pt-3">
            <span className="text-[13px] text-ink-soft">
              Posted by {listing.poster_name}
              {listing.subcategory ? ` · ${subcategoryLabel(listing.subcategory)}` : ""}
            </span>
            <span className="text-[13px] font-semibold text-varsity underline-offset-4 group-hover:underline">
              View
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
