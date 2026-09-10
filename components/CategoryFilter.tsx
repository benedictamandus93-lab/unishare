"use client";

import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

export type CategoryChoice = Category | "all";

export function CategoryFilter({
  value,
  onChange,
  counts,
}: {
  value: CategoryChoice;
  onChange: (next: CategoryChoice) => void;
  counts: Record<CategoryChoice, number>;
}) {
  const options: { value: CategoryChoice; label: string }[] = [
    { value: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ value: c.value as CategoryChoice, label: c.label })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter by section"
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-sheet border px-4 py-2 text-[14px] font-semibold transition-colors ${
              active
                ? "border-varsity bg-varsity text-white"
                : "border-board-line bg-white text-ink hover:border-ink-faint"
            }`}
          >
            {option.label}
            <span className={active ? "ml-1.5 opacity-80" : "ml-1.5 text-ink-faint"}>
              {counts[option.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
