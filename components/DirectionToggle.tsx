"use client";

import { DIRECTIONS } from "@/lib/constants";
import type { Direction } from "@/lib/types";

/**
 * The wall has two sides. Offering is what students have; Wanted is what
 * students are looking for. This is the first control on the page because it
 * changes what every filter below it applies to.
 */
export function DirectionToggle({
  value,
  onChange,
  counts,
}: {
  value: Direction;
  onChange: (next: Direction) => void;
  counts: Record<Direction, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Offering or wanted"
      className="inline-flex rounded-sheet border border-board-line bg-board-deep/50 p-1"
    >
      {DIRECTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-[2px] px-4 py-2 text-[14px] font-semibold transition-colors ${
              active
                ? "bg-white text-varsity shadow-pin"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
            <span
              className={
                active ? "ml-1.5 text-ink-faint" : "ml-1.5 text-ink-faint"
              }
            >
              {counts[option.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
