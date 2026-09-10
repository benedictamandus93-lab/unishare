import Link from "next/link";
import { ListingWall } from "@/components/ListingWall";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    href: "/buy",
    label: "Buy",
    blurb: "Textbooks, furniture, bikes and everything a flat needs.",
    accent: "bg-buy-ink",
  },
  {
    href: "/rent",
    label: "Rent",
    blurb: "Cameras, projectors and gear you only need for a weekend.",
    accent: "bg-rent-ink",
  },
  {
    href: "/services",
    label: "Services",
    blurb: "Tutoring, graduation photos, repairs and a hand when you move.",
    accent: "bg-services-ink",
  },
];

export default async function HomePage() {
  const listings = await getListings();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <div>
          <h1 className="max-w-[13ch] font-display text-[40px] font-extrabold leading-[1.03] sm:text-[54px]">
            Your student community wall
          </h1>
          <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">
            Find something. Offer something. Share something. UniShare is the
            University of Auckland noticeboard, moved online and made
            searchable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/post" className="btn-primary">
              + Post listing
            </Link>
            <Link href="/services" className="btn-quiet">
              See what students offer
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="sheet flex items-start gap-2.5 p-3 transition-shadow hover:shadow-lift sm:gap-3 sm:p-4"
            >
              <span
                aria-hidden="true"
                className={`mt-1 h-2 w-2 shrink-0 rounded-full sm:mt-1.5 sm:h-2.5 sm:w-2.5 ${section.accent}`}
              />
              <span>
                <span className="block font-display text-[13.5px] font-bold leading-tight sm:text-[17px]">
                  {section.label}
                </span>
                <span className="mt-0.5 hidden text-[13.5px] leading-relaxed text-ink-soft sm:block">
                  {section.blurb}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ListingWall listings={listings} />
    </div>
  );
}
