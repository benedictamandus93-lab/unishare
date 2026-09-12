import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "@/components/ContactButtons";
import { DeleteListingButton } from "@/components/DeleteListingButton";
import { PosterArt } from "@/components/PosterArt";
import { CATEGORY_STYLE, DIRECTION_STYLE } from "@/lib/constants";
import { getListingById } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";
import {
  formatListingPrice,
  subcategoryLabel,
  timeAgo,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = Boolean(user && listing.user_id && user.id === listing.user_id);

  const style = CATEGORY_STYLE[listing.category];
  const dir = DIRECTION_STYLE[listing.direction];
  const wanted = listing.direction === "wanted";
  const backHref = wanted ? "/wanted" : `/${listing.category}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-varsity underline underline-offset-4"
      >
        Back to the wall
      </Link>

      <article className={`sheet overflow-hidden ${dir.sheet}`}>
        <PosterArt
          title={listing.title}
          category={listing.category}
          subcategory={listing.subcategory}
          imageUrl={listing.image_url}
          tall
          wanted={wanted}
        />
        <span aria-hidden="true" className={`block h-[4px] w-full ${style.rule}`} />

        <div className="space-y-6 p-5 sm:p-7">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {wanted && <span className={`tag ${dir.tag}`}>Wanted</span>}
              <span className={`tag ${style.tag}`}>{style.label}</span>
              {listing.subcategory && (
                <span className="tag bg-board-deep text-ink-soft">
                  {subcategoryLabel(listing.subcategory)}
                </span>
              )}
              <span className="text-[13px] text-ink-faint">
                Posted {timeAgo(listing.created_at).toLowerCase()}
              </span>
            </div>

            <h1 className="font-display text-[32px] font-extrabold leading-tight sm:text-[38px]">
              {listing.title}
            </h1>

            <p className="text-[26px] font-bold text-varsity">
              {formatListingPrice(
                listing.price,
                listing.price_unit,
                listing.direction,
              )}
            </p>
          </header>

          <p className="max-w-[65ch] whitespace-pre-line text-[16px] leading-relaxed text-ink-soft">
            {listing.description}
          </p>

          <div className="border-t border-dashed border-board-line pt-5">
            <p className="text-[15px] font-semibold">
              {wanted ? "Wanted by" : "Posted by"} {listing.poster_name}
            </p>
            <p className="mt-1 text-[14px] text-ink-soft">
              {wanted
                ? `If you have one of these, contact ${listing.poster_name} directly.`
                : `Contact ${listing.poster_name} directly to arrange the details.`}
            </p>
            <div className="mt-4">
              <ContactButtons listing={listing} />
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap items-center gap-3 rounded-sheet bg-board-deep/50 p-4">
              <span className="text-[14px] font-semibold">
                This is your listing.
              </span>
              <Link
                href={`/account/listings/${listing.id}/edit`}
                className="btn-quiet"
              >
                Edit
              </Link>
              <DeleteListingButton listingId={listing.id} />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
