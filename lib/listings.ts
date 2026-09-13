import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

/**
 * Selecting every column keeps the site working whether or not the optional
 * migrations have been applied yet. A missing column then shows up as an
 * undefined field, which normaliseListing repairs, rather than as a failed
 * query or a crash.
 */
const COLUMNS = "*";

/** Guarantees every field the components rely on, whatever the database returns. */
function normaliseListing(row: Record<string, unknown>): Listing {
  const direction = row.direction === "wanted" ? "wanted" : "offering";
  const category =
    row.category === "rent" || row.category === "services"
      ? row.category
      : "buy";

  return {
    ...(row as unknown as Listing),
    direction,
    category,
    poster_name: (row.poster_name as string) || "A student",
    title: (row.title as string) || "Untitled listing",
    description: (row.description as string) || "",
    price: Number(row.price ?? 0),
    price_unit: ["fixed", "hour", "day", "from"].includes(
      row.price_unit as string,
    )
      ? (row.price_unit as Listing["price_unit"])
      : "fixed",
    subcategory: (row.subcategory as Listing["subcategory"]) ?? null,
    image_url: (row.image_url as string) ?? null,
  };
}

/**
 * Reads every listing on the wall. The prototype holds a small, community
 * sized dataset, so one query plus in browser filtering keeps search and
 * filters instant and free of page reloads.
 */
export async function getListings(): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getListings:", error.message);
      return [];
    }
    return (data ?? []).map(normaliseListing);
  } catch (error) {
    console.error("getListings:", error);
    return [];
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getListingById:", error.message);
      return null;
    }
    return data ? normaliseListing(data) : null;
  } catch (error) {
    console.error("getListingById:", error);
    return null;
  }
}

export async function getMyListings(userId: string): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getMyListings:", error.message);
      return [];
    }
    return (data ?? []).map(normaliseListing);
  } catch (error) {
    console.error("getMyListings:", error);
    return [];
  }
}
