"use client";

import { Users, Star, Clock, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type PeopleSection = "all" | "favourites" | "recent" | "family" | "new";

interface PeopleNavProps {
  activeSection: PeopleSection;
  onSectionChange: (section: PeopleSection) => void;
  counts?: { all: number; favourites: number; recent: number; family: number };
}

const NAV_ITEMS: { id: PeopleSection; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All", icon: Users },
  { id: "favourites", label: "Favourites", icon: Star },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "family", label: "Family", icon: Heart },
  { id: "new", label: "New Person", icon: Plus },
];

export function PeopleNav({ activeSection, onSectionChange, counts }: PeopleNavProps) {
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
              {counts && id !== "new" && (
                <span className="text-xs text-slate-500">
                  {counts[id]}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

