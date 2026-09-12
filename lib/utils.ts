import {
  ALLOWED_EMAIL_DOMAINS,
  CATEGORIES,
  SUBCATEGORIES,
} from "./constants";
import type {
  Category,
  Direction,
  Listing,
  PriceUnit,
  Subcategory,
} from "./types";

/** Client side guard. The database enforces the same rule on the server. */
export function isUniversityEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1 || at === value.length - 1) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (/\s/.test(value)) return false;
  return local.length > 0 && ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Keeps digits only, so that wa.me and sms: links stay well formed. */
export function normalisePhone(input: string): string {
  return input.replace(/[^\d]/g, "");
}

/**
 * On a wanted listing the figure is what the student is willing to pay, so it
 * is presented as a budget rather than as an asking price.
 */
export function formatListingPrice(
  price: number,
  unit: PriceUnit,
  direction: Direction,
): string {
  const amount = Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
  if (direction === "wanted") {
    switch (unit) {
      case "hour":
        return `Budget ${amount} / hour`;
      case "day":
        return `Budget ${amount} / day`;
      default:
        return `Budget up to ${amount}`;
    }
  }
  return formatPrice(price, unit);
}

export function formatPrice(price: number, unit: PriceUnit): string {
  const amount =
    Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
  switch (unit) {
    case "hour":
      return `${amount} / hour`;
    case "day":
      return `${amount} / day`;
    case "from":
      return `From ${amount}`;
    default:
      return amount;
  }
}

export function categoryLabel(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function subcategoryLabel(subcategory: Subcategory | null): string {
  if (!subcategory) return "";
  return SUBCATEGORIES.find((s) => s.value === subcategory)?.label ?? subcategory;
}

/** One searchable string per listing, covering title, description, category and service type. */
export function searchIndex(listing: Listing): string {
  return [
    listing.title,
    listing.description,
    listing.direction === "wanted" ? "wanted looking for" : "offering",
    categoryLabel(listing.category),
    subcategoryLabel(listing.subcategory),
    listing.poster_name,
  ]
    .join(" ")
    .toLowerCase();
}

export function contactLinks(listing: Listing) {
  const subject = encodeURIComponent(`UniShare: ${listing.title}`);
  const body = encodeURIComponent(
    `Hi ${listing.poster_name},\n\nI saw your UniShare listing "${listing.title}" and I am interested.\n\nThanks`,
  );
  const message = encodeURIComponent(
    `Hi ${listing.poster_name}, I saw your UniShare listing "${listing.title}".`,
  );

  return {
    email: listing.email_contact
      ? `mailto:${listing.email_contact}?subject=${subject}&body=${body}`
      : null,
    whatsapp: listing.whatsapp_contact
      ? `https://wa.me/${normalisePhone(listing.whatsapp_contact)}?text=${message}`
      : null,
    sms: listing.sms_contact
      ? `sms:${listing.sms_contact}?&body=${message}`
      : null,
  };
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
  });
}

/** Turns a Supabase error into wording a student can act on. */
export function friendlyError(message: string | undefined): string {
  const text = (message ?? "").toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  if (text.includes("university of auckland") || text.includes("auckland.ac.nz")) {
    return "Please use a University of Auckland email address ending in @auckland.ac.nz or @aucklanduni.ac.nz.";
  }
  if (text.includes("already registered") || text.includes("already exists")) {
    return "An account already exists for this email address. Please sign in instead.";
  }
  if (text.includes("email not confirmed")) {
    return "Please confirm your university email first. The confirmation link was sent when you registered.";
  }
  if (text.includes("password")) {
    return "Your password must be at least 8 characters long.";
  }
  if (text.includes("row-level security") || text.includes("policy")) {
    return "You do not have permission to change this listing.";
  }
  return "Something went wrong. Please try again.";
}
