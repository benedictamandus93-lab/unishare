"use client";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search UniShare...",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search listings"
        className="w-full rounded-sheet border border-board-line bg-white py-3.5 pl-11 pr-4 text-[16px]
                   shadow-pin placeholder:text-ink-faint focus:border-varsity focus:outline-none"
      />
    </div>
  );
}
