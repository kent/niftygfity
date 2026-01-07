"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Palette, Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Hydration-safe mounted check using useSyncExternalStore
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type ThemeOption = "light" | "dark" | "system";

interface ThemeCardProps {
  theme: ThemeOption;
  label: string;
  description: string;
  icon: typeof Sun;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemePreview({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "w-full aspect-[4/3] rounded-lg overflow-hidden border",
        isDark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-slate-200"
      )}
    >
      {/* Mini header */}
      <div
        className={cn(
          "h-3 flex items-center gap-1 px-2",
          isDark ? "bg-slate-800" : "bg-slate-100"
        )}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      {/* Mini content */}
      <div className="p-2 space-y-1.5">
        <div
          className={cn(
            "h-2 w-3/4 rounded",
            isDark ? "bg-slate-700" : "bg-slate-200"
          )}
        />
        <div
          className={cn(
            "h-2 w-1/2 rounded",
            isDark ? "bg-slate-700" : "bg-slate-200"
          )}
        />
        <div className="flex gap-1 pt-1">
          <div className="h-3 w-8 rounded bg-violet-500" />
          <div
            className={cn(
              "h-3 w-8 rounded",
              isDark ? "bg-slate-700" : "bg-slate-200"
            )}
          />
        </div>
      </div>
    </div>
  );
}

function SystemPreview() {
  return (
    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-600 relative">
      {/* Split view - light on left, dark on right */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-white">
          <div className="h-3 flex items-center gap-0.5 px-1.5 bg-slate-100">
            <div className="w-1 h-1 rounded-full bg-red-400" />
            <div className="w-1 h-1 rounded-full bg-yellow-400" />
            <div className="w-1 h-1 rounded-full bg-green-400" />
          </div>
          <div className="p-1.5 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-slate-200" />
            <div className="h-1.5 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
        <div className="w-1/2 bg-slate-900">
          <div className="h-3 flex items-center justify-end gap-0.5 px-1.5 bg-slate-800">
            <div className="w-1 h-1 rounded-full bg-red-400" />
            <div className="w-1 h-1 rounded-full bg-yellow-400" />
            <div className="w-1 h-1 rounded-full bg-green-400" />
          </div>
          <div className="p-1.5 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-slate-700" />
            <div className="h-1.5 w-1/2 rounded bg-slate-700" />
          </div>
        </div>
      </div>
      {/* Diagonal line separator */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-500"
          />
        </svg>
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  label,
  description,
  icon: Icon,
  isSelected,
  onSelect,
}: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative rounded-2xl border p-4 text-left transition-all duration-300",
        "hover:shadow-lg",
        isSelected
          ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30"
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Theme preview */}
      <div className="mb-4">
        {theme === "system" ? (
          <SystemPreview />
        ) : (
          <ThemePreview theme={theme} />
        )}
      </div>

      {/* Label and description */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
            isSelected
              ? "bg-violet-500/20 text-violet-400"
              : "bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/50 group-hover:text-slate-600 dark:group-hover:text-slate-300"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "font-semibold transition-colors",
            isSelected
              ? "text-violet-700 dark:text-white"
              : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
          )}
        >
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-sm transition-colors pl-9",
          isSelected ? "text-slate-600 dark:text-slate-300" : "text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400"
        )}
      >
        {description}
      </p>
    </button>
  );
}

const THEME_OPTIONS: {
  theme: ThemeOption;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    theme: "light",
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
  },
  {
    theme: "dark",
    label: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
  },
  {
    theme: "system",
    label: "System",
    description: "Follows your device settings",
    icon: Monitor,
  },
];

export function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <section className="space-y-8">
        {/* Header skeleton */}
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
              <Palette className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Appearance</h2>
              <p className="text-slate-400 text-sm">
                Customize how Listy Gifty looks on your device
              </p>
            </div>
          </div>
        </div>
        {/* Loading skeleton for theme cards */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-4 animate-pulse"
            >
              <div className="w-full aspect-[4/3] rounded-lg bg-slate-800 mb-4" />
              <div className="h-4 w-20 rounded bg-slate-800 mb-2" />
              <div className="h-3 w-32 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <Palette className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Appearance</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Customize how Listy Gifty looks on your device
            </p>
          </div>
        </div>
      </div>

      {/* Theme selection card */}
      <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-6">
          <div className="mb-6">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">
              Theme
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select your preferred color scheme
            </p>
          </div>

          {/* Theme options grid */}
          <div className="grid grid-cols-3 gap-4">
            {THEME_OPTIONS.map((option) => (
              <ThemeCard
                key={option.theme}
                {...option}
                isSelected={theme === option.theme}
                onSelect={() => setTheme(option.theme)}
              />
            ))}
          </div>

          {/* Current theme indicator */}
          {theme === "system" && (
            <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/50">
                {resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                )}
              </div>
              <div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Your system is currently using{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {resolvedTheme === "dark" ? "dark" : "light"}
                  </span>{" "}
                  mode
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
