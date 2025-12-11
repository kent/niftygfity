"use client";

import { Sparkles, Clock, Plus, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export type HolidaysSection = "active" | "past" | "archived" | "new";

interface HolidaysNavProps {
  activeSection: HolidaysSection;
  onSectionChange: (section: HolidaysSection) => void;
  activeCounts?: { active: number; past: number; archived: number };
}

const NAV_ITEMS: { id: HolidaysSection; label: string; icon: typeof Sparkles }[] = [
  { id: "active", label: "Active", icon: Sparkles },
  { id: "past", label: "Past", icon: Clock },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "new", label: "New Holiday", icon: Plus },
];

export function HolidaysNav({ activeSection, onSectionChange, activeCounts }: HolidaysNavProps) {
  return (
    <nav className="w-56 shrink-0">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => onSectionChange(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activeSection === id
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {activeCounts && id !== "new" && (
                <span className="text-xs text-slate-500">
                  {id === "active" ? activeCounts.active : id === "past" ? activeCounts.past : activeCounts.archived}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

