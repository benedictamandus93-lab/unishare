"use client";

import { SUBCATEGORIES } from "@/lib/constants";
import type { Subcategory } from "@/lib/types";

export type SubcategoryChoice = Subcategory | "all";

export function ServiceFilter({
  value,
  onChange,
}: {
  value: SubcategoryChoice;
  onChange: (next: SubcategoryChoice) => void;
}) {
  const options: { value: SubcategoryChoice; label: string }[] = [
    { value: "all", label: "All Services" },
    ...SUBCATEGORIES.map((s) => ({ value: s.value as SubcategoryChoice, label: s.label })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-board-line pt-3">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              active
                ? "border-services-ink bg-services-wash text-services-ink"
                : "border-board-line bg-white text-ink-soft hover:border-ink-faint"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
