import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

const COLUMNS =
  "id,user_id,poster_name,category,subcategory,title,description,price,price_unit,image_url,email_contact,whatsapp_contact,sms_contact,created_at,updated_at";

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
    return (data ?? []) as Listing[];
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
    return (data as Listing) ?? null;
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
    return (data ?? []) as Listing[];
  } catch (error) {
    console.error("getMyListings:", error);
    return [];
  }
}
