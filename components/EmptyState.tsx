export function EmptyState({
  title = "No listings found.",
  hint = "Try another search or remove some filters.",
  action,
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="sheet flex flex-col items-center gap-3 px-6 py-14 text-center">
      <svg
        viewBox="0 0 64 64"
        className="h-11 w-11 text-ink-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="8" y="12" width="48" height="40" rx="3" />
        <path d="M20 26h24M20 38h14" strokeDasharray="4 6" />
      </svg>
      <h2 className="font-display text-[22px] font-semibold">{title}</h2>
      <p className="max-w-sm text-[15px] text-ink-soft">{hint}</p>
      {action}
    </div>
  );
}
