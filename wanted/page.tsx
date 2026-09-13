import { ListingWall } from "@/components/ListingWall";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Wanted | UniShare" };

export default async function WantedPage() {
  const listings = await getListings();

  return (
    <div className="space-y-7">
      <header className="max-w-[54ch]">
        <h1 className="font-display text-[34px] font-extrabold leading-tight">
          Wanted
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
          What students are looking for. If you have one of these sitting unused
          in your flat, someone on campus already wants it.
        </p>
      </header>
      <ListingWall listings={listings} initialDirection="wanted" />
    </div>
  );
}
