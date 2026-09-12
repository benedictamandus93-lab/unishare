"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Direction, Listing } from "@/lib/types";
import { searchIndex } from "@/lib/utils";
import { CategoryFilter, type CategoryChoice } from "./CategoryFilter";
import { DirectionToggle } from "./DirectionToggle";
import { EmptyState } from "./EmptyState";
import { ListingGrid } from "./ListingGrid";
import { SearchBar } from "./SearchBar";
import { ServiceFilter, type SubcategoryChoice } from "./ServiceFilter";

export function ListingWall({
  listings,
  initialCategory = "all",
  initialDirection = "offering",
  lockCategory = false,
}: {
  listings: Listing[];
  initialCategory?: CategoryChoice;
  initialDirection?: Direction;
  lockCategory?: boolean;
}) {
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [category, setCategory] = useState<CategoryChoice>(initialCategory);
  const [subcategory, setSubcategory] = useState<SubcategoryChoice>("all");
  const [query, setQuery] = useState("");

  const directionCounts = useMemo(
    () => ({
      offering: listings.filter((l) => l.direction === "offering").length,
      wanted: listings.filter((l) => l.direction === "wanted").length,
    }) as Record<Direction, number>,
    [listings],
  );

  // Category counts are scoped to the side of the wall currently shown, so the
  // numbers on the chips always match what selecting them would return.
  const counts = useMemo(() => {
    const side = listings.filter((l) => l.direction === direction);
    return {
      all: side.length,
      buy: side.filter((l) => l.category === "buy").length,
      rent: side.filter((l) => l.category === "rent").length,
      services: side.filter((l) => l.category === "services").length,
    } as Record<CategoryChoice, number>;
  }, [listings, direction]);

  // Search and both filters are applied together, in the browser, with no reload.
  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return listings.filter((listing) => {
      if (listing.direction !== direction) return false;
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
  }, [listings, direction, category, subcategory, query]);

  const showServiceFilter = category === "services";

  function handleCategoryChange(next: CategoryChoice) {
    setCategory(next);
    if (next !== "services") setSubcategory("all");
  }

  return (
    <div className="space-y-6">
      <div className="sheet space-y-4 p-4 sm:p-5">
        <DirectionToggle
          value={direction}
          onChange={setDirection}
          counts={directionCounts}
        />
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={
            direction === "wanted"
              ? "Search what students are looking for..."
              : "Search UniShare..."
          }
        />
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
          {visible.length}{" "}
          {direction === "wanted"
            ? visible.length === 1
              ? "student is looking for something"
              : "students are looking for something"
            : visible.length === 1
              ? "listing on the wall"
              : "listings on the wall"}
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
      ) : direction === "wanted" ? (
        <EmptyState
          title="Nobody is looking for this yet."
          hint="Post what you are after and other students will see it here."
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
