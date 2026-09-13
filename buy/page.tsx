import { ListingWall } from "@/components/ListingWall";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buy | UniShare" };

export default async function BuyPage() {
  const listings = await getListings();

  return (
    <div className="space-y-7">
      <header className="max-w-[52ch]">
        <h1 className="font-display text-[34px] font-extrabold leading-tight">Buy</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
          Second hand textbooks, desk lamps, bikes and flat gear that other
          students have finished with.
        </p>
      </header>
      <ListingWall listings={listings} initialCategory="buy" />
    </div>
  );
}
