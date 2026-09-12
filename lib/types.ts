/** Which side of the wall a listing sits on. */
export type Direction = "offering" | "wanted";

export type Category = "buy" | "rent" | "services";

export type Subcategory =
  | "photography"
  | "makeup-beauty"
  | "tutoring"
  | "repairs"
  | "design"
  | "moving-help"
  | "cleaning"
  | "other";

export type PriceUnit = "fixed" | "hour" | "day" | "from";

export interface Listing {
  id: string;
  user_id: string | null;
  poster_name: string;
  direction: Direction;
  category: Category;
  subcategory: Subcategory | null;
  title: string;
  description: string;
  price: number;
  price_unit: PriceUnit;
  image_url: string | null;
  email_contact: string | null;
  whatsapp_contact: string | null;
  sms_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  university_email: string;
  created_at: string;
}

export interface ListingDraft {
  direction: Direction;
  category: Category;
  subcategory: Subcategory | null;
  title: string;
  description: string;
  price: number;
  price_unit: PriceUnit;
  image_url: string | null;
  email_contact: string | null;
  whatsapp_contact: string | null;
  sms_contact: string | null;
}
