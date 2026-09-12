import type { Category } from "@/lib/types";

/**
 * Listings without an uploaded photo still need to look like a printed flyer
 * on a board, so a simple drawn motif is chosen from words in the title.
 */
const MOTIFS: { keys: string[]; art: React.ReactNode }[] = [
  {
    keys: ["textbook", "book", "notes", "calculus"],
    art: (
      <>
        <rect x="20" y="18" width="44" height="58" rx="2" />
        <path d="M20 18h44M28 32h28M28 42h28M28 52h18" />
      </>
    ),
  },
  {
    keys: ["lamp", "light"],
    art: (
      <>
        <path d="M26 34 42 12l16 22z" />
        <path d="M42 34v34M30 74h24" />
      </>
    ),
  },
  {
    keys: ["bicycle", "bike", "cycle"],
    art: (
      <>
        <circle cx="24" cy="58" r="14" />
        <circle cx="60" cy="58" r="14" />
        <path d="M24 58l14-26h12M38 32l14 26M50 32h10" />
      </>
    ),
  },
  {
    keys: ["microwave", "kitchen", "oven", "fridge"],
    art: (
      <>
        <rect x="12" y="26" width="60" height="40" rx="3" />
        <rect x="20" y="34" width="30" height="24" rx="2" />
        <path d="M58 36v18" />
      </>
    ),
  },
  {
    keys: ["camera", "photo", "photograph", "photography"],
    art: (
      <>
        <rect x="12" y="28" width="60" height="40" rx="4" />
        <circle cx="42" cy="48" r="13" />
        <path d="M28 28l5-8h18l5 8" />
      </>
    ),
  },
  {
    keys: ["projector", "screen", "display"],
    art: (
      <>
        <rect x="10" y="34" width="46" height="26" rx="3" />
        <circle cx="30" cy="47" r="8" />
        <path d="M56 40l18-8v30l-18-8" />
      </>
    ),
  },
  {
    keys: ["camping", "tent", "outdoor", "hiking"],
    art: (
      <>
        <path d="M42 16 12 72h60z" />
        <path d="M42 16v56M30 72l12-24 12 24" />
      </>
    ),
  },
  {
    keys: ["makeup", "beauty", "hair", "styling", "dress"],
    art: (
      <>
        <path d="M34 20h16l-4 34H38z" />
        <rect x="34" y="54" width="16" height="22" rx="3" />
        <path d="M60 24l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
      </>
    ),
  },
  {
    keys: ["tutor", "statistics", "maths", "math", "english", "programming"],
    art: (
      <>
        <rect x="12" y="20" width="60" height="44" rx="3" />
        <path d="M22 54l12-16 10 10 8-14 10 20" />
        <path d="M32 72h20" />
      </>
    ),
  },
  {
    keys: ["repair", "laptop", "phone", "computer", "fix"],
    art: (
      <>
        <rect x="16" y="24" width="52" height="34" rx="3" />
        <path d="M10 66h64M28 40l-6 6 6 6M56 40l6 6-6 6" />
      </>
    ),
  },
  {
    keys: ["design", "graphic", "video", "editing", "art"],
    art: (
      <>
        <path d="M42 16c15 0 27 11 27 24 0 9-8 12-14 12-5 0-8 3-8 7 0 5-3 9-9 9-14 0-24-11-24-26S27 16 42 16z" />
        <circle cx="31" cy="34" r="4" />
        <circle cx="47" cy="30" r="4" />
        <circle cx="57" cy="42" r="4" />
      </>
    ),
  },
  {
    keys: ["moving", "move", "boxes", "furniture", "desk", "chair"],
    art: (
      <>
        <path d="M14 34h56v34H14z" />
        <path d="M14 34l8-14h40l8 14M42 34v34" />
      </>
    ),
  },
  {
    keys: ["cleaning", "clean", "wash"],
    art: (
      <>
        <path d="M50 14 30 44" />
        <path d="M24 46h20l6 26H18z" />
        <path d="M26 56h16M24 66h20" />
      </>
    ),
  },
];

const FALLBACK = (
  <>
    <rect x="16" y="20" width="52" height="52" rx="3" />
    <path d="M16 56l14-14 12 12 10-10 16 16" />
    <circle cx="34" cy="34" r="5" />
  </>
);

function pickMotif(title: string, subcategory: string | null) {
  const haystack = `${title} ${subcategory ?? ""}`.toLowerCase();
  const found = MOTIFS.find((m) => m.keys.some((k) => haystack.includes(k)));
  return found?.art ?? FALLBACK;
}

const WASH: Record<Category, string> = {
  buy: "bg-buy-wash text-buy-ink",
  rent: "bg-rent-wash text-rent-ink",
  services: "bg-services-wash text-services-ink",
};

const LOOKING_FOR = (
  <>
    <circle cx="36" cy="38" r="20" />
    <path d="M51 53l18 18" />
    <path d="M28 38h16M36 30v16" />
  </>
);

export function PosterArt({
  title,
  category,
  subcategory,
  imageUrl,
  tall = false,
  wanted = false,
}: {
  title: string;
  category: Category;
  subcategory: string | null;
  imageUrl: string | null;
  tall?: boolean;
  wanted?: boolean;
}) {
  const ratio = tall ? "aspect-[16/9]" : "aspect-[16/10]";

  if (imageUrl) {
    return (
      <div className={`${ratio} w-full overflow-hidden bg-board-deep`}>
        {/* A plain img keeps uploads from any Supabase project working without extra config. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${ratio} ${WASH[category]} flex w-full items-center justify-center overflow-hidden`}
      role="img"
      aria-label={
        wanted
          ? `Drawing indicating a student is looking for ${title}`
          : `Drawing representing ${title}`
      }
    >
      <svg
        viewBox="0 0 84 88"
        className={tall ? "h-28 w-auto sm:h-36" : "h-24 w-auto"}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {wanted ? LOOKING_FOR : pickMotif(title, subcategory)}
      </svg>
    </div>
  );
}
