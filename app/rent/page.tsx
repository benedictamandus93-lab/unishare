import { ListingWall } from "@/components/ListingWall";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Rent | UniShare" };

export default async function RentPage() {
  const listings = await getListings();

  return (
    <div className="space-y-7">
      <header className="max-w-[52ch]">
        <h1 className="font-display text-[34px] font-extrabold leading-tight">Rent</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
          Gear you only need for a weekend, a shoot or one assignment, borrowed
          from someone on campus.
        </p>
      </header>
      <ListingWall listings={listings} initialCategory="rent" />
    </div>
  );
}
