import type { Category, Direction, PriceUnit, Subcategory } from "./types";

export const SITE_NAME = "UniShare";

export const ALLOWED_EMAIL_DOMAINS = ["auckland.ac.nz", "aucklanduni.ac.nz"];

export const EMAIL_DOMAIN_MESSAGE =
  "Please use a University of Auckland email address ending in @auckland.ac.nz or @aucklanduni.ac.nz.";

/**
 * Direction and category are two separate questions. Direction asks who holds
 * the item; category asks how it changes hands. Keeping them apart avoids a
 * combined list such as "wanted to rent", which would grow unmanageably.
 */
export const DIRECTIONS: {
  value: Direction;
  label: string;
  blurb: string;
  verb: string;
}[] = [
  {
    value: "offering",
    label: "Offering",
    blurb: "Things students have",
    verb: "is offering",
  },
  {
    value: "wanted",
    label: "Wanted",
    blurb: "Things students are looking for",
    verb: "is looking for",
  },
];

export const CATEGORIES: { value: Category; label: string; blurb: string }[] = [
  { value: "buy", label: "Buy", blurb: "Things students are selling" },
  { value: "rent", label: "Rent", blurb: "Things you can borrow for a fee" },
  { value: "services", label: "Services", blurb: "Skills students can offer" },
];

export const SUBCATEGORIES: { value: Subcategory; label: string }[] = [
  { value: "photography", label: "Photography" },
  { value: "makeup-beauty", label: "Makeup & Beauty" },
  { value: "tutoring", label: "Tutoring" },
  { value: "repairs", label: "Repairs" },
  { value: "design", label: "Design" },
  { value: "moving-help", label: "Moving Help" },
  { value: "cleaning", label: "Cleaning" },
  { value: "other", label: "Other" },
];

export const PRICE_UNITS: { value: PriceUnit; label: string }[] = [
  { value: "fixed", label: "One fixed price" },
  { value: "hour", label: "Per hour" },
  { value: "day", label: "Per day" },
  { value: "from", label: "Starting from" },
];

export const CATEGORY_STYLE: Record<
  Category,
  { tag: string; rule: string; dot: string; label: string }
> = {
  buy: {
    tag: "bg-buy-wash text-buy-ink",
    rule: "bg-buy-ink",
    dot: "bg-buy-ink",
    label: "Buy",
  },
  rent: {
    tag: "bg-rent-wash text-rent-ink",
    rule: "bg-rent-ink",
    dot: "bg-rent-ink",
    label: "Rent",
  },
  services: {
    tag: "bg-services-wash text-services-ink",
    rule: "bg-services-ink",
    dot: "bg-services-ink",
    label: "Services",
  },
};

export const DIRECTION_STYLE: Record<
  Direction,
  { tag: string; sheet: string; pin: string }
> = {
  offering: {
    tag: "bg-board-deep text-ink-soft",
    sheet: "",
    pin: "ring-board",
  },
  wanted: {
    // A wanted note reads as a different kind of paper on the same board.
    tag: "bg-varsity text-white",
    sheet: "border-dashed border-varsity/45 bg-[#F7FAFC]",
    pin: "ring-board",
  },
};

export const STORAGE_BUCKET = "listing-images";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
