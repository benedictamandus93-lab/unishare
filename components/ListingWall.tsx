"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Listing } from "@/lib/types";
import { searchIndex } from "@/lib/utils";
import { CategoryFilter, type CategoryChoice } from "./CategoryFilter";
import { EmptyState } from "./EmptyState";
import { ListingGrid } from "./ListingGrid";
import { SearchBar } from "./SearchBar";
import { ServiceFilter, type SubcategoryChoice } from "./ServiceFilter";

export function ListingWall({
  listings,
  initialCategory = "all",
  lockCategory = false,
}: {
  listings: Listing[];
  initialCategory?: CategoryChoice;
  lockCategory?: boolean;
}) {
  const [category, setCategory] = useState<CategoryChoice>(initialCategory);
  const [subcategory, setSubcategory] = useState<SubcategoryChoice>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: listings.length,
      buy: listings.filter((l) => l.category === "buy").length,
      rent: listings.filter((l) => l.category === "rent").length,
      services: listings.filter((l) => l.category === "services").length,
    } as Record<CategoryChoice, number>;
  }, [listings]);

  // Search and both filters are applied together, in the browser, with no reload.
  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return listings.filter((listing) => {
      if (category !== "all" && listing.category !== category) return false;
      if (
        category === "services" &&
        subcategory !== "all" &&
        listing.subcategory !== subcategory
      ) {
        return false;
      }
      if (terms.length === 0) return true;
      const haystack = searchIndex(listing);
      return terms.every((term) => haystack.includes(term));
    });
  }, [listings, category, subcategory, query]);

  const showServiceFilter = category === "services";

  function handleCategoryChange(next: CategoryChoice) {
    setCategory(next);
    if (next !== "services") setSubcategory("all");
  }

  return (
    <div className="space-y-6">
      <div className="sheet space-y-4 p-4 sm:p-5">
        <SearchBar value={query} onChange={setQuery} />
        {!lockCategory && (
          <CategoryFilter
            value={category}
            onChange={handleCategoryChange}
            counts={counts}
          />
        )}
        {showServiceFilter && (
          <ServiceFilter value={subcategory} onChange={setSubcategory} />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[14px] text-ink-soft">
          {visible.length} {visible.length === 1 ? "listing" : "listings"} on the
          wall
        </p>
        <Link
          href="/post"
          className="text-[14px] font-semibold text-varsity underline underline-offset-4"
        >
          Pin your own
        </Link>
      </div>

      {visible.length > 0 ? (
        <ListingGrid listings={visible} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
