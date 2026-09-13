import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteListingButton } from "@/components/DeleteListingButton";
import { EmptyState } from "@/components/EmptyState";
import { categoryStyle } from "@/lib/constants";
import { getMyListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "My listings | UniShare" };

export default async function MyListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/listings");

  const listings = await getMyListings(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[32px] font-extrabold leading-tight">
            My listings
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            Edit or take down anything you have pinned to the wall.
          </p>
        </div>
        <Link href="/post" className="btn-primary">
          + Post listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="Nothing pinned yet."
          hint="Post a textbook, a camera or a skill you can offer, and it appears on the wall straight away."
          action={
            <Link href="/post" className="btn-primary mt-2">
              Post your first listing
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => {
            const style = categoryStyle(listing.category);
            return (
              <li key={listing.id} className="sheet p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className={`tag ${style.tag}`}>{style.label}</span>
                    <h2 className="mt-2 font-display text-[19px] font-semibold">
                      {listing.title}
                    </h2>
                    <p className="mt-0.5 text-[14px] text-ink-soft">
                      {formatPrice(listing.price, listing.price_unit)} · posted{" "}
                      {timeAgo(listing.created_at).toLowerCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/listing/${listing.id}`} className="btn-quiet">
                      View
                    </Link>
                    <Link
                      href={`/account/listings/${listing.id}/edit`}
                      className="btn-quiet"
                    >
                      Edit
                    </Link>
                    <DeleteListingButton listingId={listing.id} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
