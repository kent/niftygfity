"use client";

import { Tags, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSection = "profile" | "statuses" | "billing";

interface SettingsNavProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const NAV_ITEMS: { id: SettingsSection; label: string; icon: typeof User; disabled?: boolean }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "statuses", label: "Gift Statuses", icon: Tags },
  { id: "billing", label: "Billing", icon: CreditCard, disabled: true },
];

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  return (
    <nav className="w-56 shrink-0">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon, disabled }) => (
          <li key={id}>
            <button
              onClick={() => !disabled && onSectionChange(id)}
              disabled={disabled}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activeSection === id
                  ? "bg-violet-500/20 text-violet-300"
                  : disabled
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {disabled && (
                <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

