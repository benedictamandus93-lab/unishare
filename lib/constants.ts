import type { Category, PriceUnit, Subcategory } from "./types";

export const SITE_NAME = "UniShare";

export const ALLOWED_EMAIL_DOMAINS = ["auckland.ac.nz", "aucklanduni.ac.nz"];

export const EMAIL_DOMAIN_MESSAGE =
  "Please use a University of Auckland email address ending in @auckland.ac.nz or @aucklanduni.ac.nz.";

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

export const STORAGE_BUCKET = "listing-images";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
