import { ListingWall } from "@/components/ListingWall";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services | UniShare" };

export default async function ServicesPage() {
  const listings = await getListings();

  return (
    <div className="space-y-7">
      <header className="max-w-[52ch]">
        <h1 className="font-display text-[34px] font-extrabold leading-tight">
          Services
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
          Skills students offer each other, from graduation photography and
          makeup to tutoring, repairs and moving help.
        </p>
      </header>
      <ListingWall listings={listings} initialCategory="services" />
    </div>
  );
}
