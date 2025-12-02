"use client";

import { RELATIONSHIP_CATEGORIES } from "@niftygifty/types";
import { cn } from "@/lib/utils";

export type RelationshipFilterValue = typeof RELATIONSHIP_CATEGORIES[number] | "all" | "other";

interface RelationshipFilterProps {
  value: RelationshipFilterValue;
  onChange: (value: RelationshipFilterValue) => void;
}

const FILTER_OPTIONS: { value: RelationshipFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...RELATIONSHIP_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  })),
  { value: "other", label: "Other" },
];

export function RelationshipFilter({ value, onChange }: RelationshipFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            value === option.value
              ? "bg-violet-500/20 text-violet-300 border border-violet-500/50"
              : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-600"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

