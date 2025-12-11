"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { holidaysService, AUTH_ROUTES } from "@/services";
import { AppHeader } from "@/components/layout";
import { HolidaysNav, type HolidaysSection } from "@/components/holidays";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronRight, Plus, Pencil, Check, Archive, RotateCcw, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Holiday } from "@niftygifty/types";

function getHolidayIcon(icon?: string | null) {
  const icons: Record<string, string> = {
    christmas: "🎄",
    gift: "🎁",
    candle: "🕎",
    flame: "🪔",
    egg: "🐰",
    heart: "💝",
    "heart-handshake": "💐",
    user: "👔",
    cake: "🎂",
    "calendar-heart": "💍",
    utensils: "🦃",
    "party-popper": "🎉",
    "graduation-cap": "🎓",
    hanukkah: "🕎",
    diwali: "🪔",
    easter: "🐰",
    birthday: "🎂",
    thanksgiving: "🦃",
    valentines: "💝",
    mothers_day: "💐",
    fathers_day: "👔",
    moon: "🌙",
    star: "⭐",
  };
  return icon ? icons[icon] || "🎁" : "🎁";
}

function HolidayCard({
  holiday,
  onToggleComplete,
  onToggleArchive,
}: {
  holiday: Holiday;
  onToggleComplete?: (holiday: Holiday) => void;
  onToggleArchive?: (holiday: Holiday) => void;
}) {
  const icon = getHolidayIcon(holiday.icon);
  const date = holiday.date ? new Date(holiday.date) : null;
  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const isShared = !holiday.is_owner;

  return (
    <div className="relative group">
      <Link href={`/holidays/${holiday.id}`}>
        <Card className={`border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-violet-500/50 transition-all cursor-pointer ${isShared ? "border-l-2 border-l-cyan-500/50" : ""}`}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${isShared ? "bg-gradient-to-br from-cyan-500/20 to-violet-500/20" : "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">{holiday.name}</h3>
                {isShared && (
                  <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/50 gap-1 shrink-0">
                    <Users className="h-3 w-3" />
                    Shared
                  </Badge>
                )}
              </div>
              {formattedDate && <p className="text-sm text-slate-400">{formattedDate}</p>}
            </div>
            <div className="w-5" /> {/* Spacer for arrow/button */}
          </CardContent>
        </Card>
      </Link>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {onToggleArchive && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleArchive(holiday);
            }}
            title="Archive"
          >
            <Archive className="h-4 w-4" />
          </Button>
        )}
        {onToggleComplete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleComplete(holiday);
            }}
            title={holiday.completed ? "Mark as active" : "Mark as complete"}
          >
            {holiday.completed ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        )}
        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-violet-400 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}

function TemplateCard({
  holiday,
  onSelect,
}: {
  holiday: Holiday;
  onSelect: (holiday: Holiday) => void;
}) {
  const icon = getHolidayIcon(holiday.icon);

  return (
    <button
      onClick={() => onSelect(holiday)}
      className="w-full text-left"
    >
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-violet-500/50 transition-all group cursor-pointer">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-2xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{holiday.name}</h3>
            <p className="text-sm text-slate-500">Click to add</p>
          </div>
          <Plus className="h-5 w-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
        </CardContent>
      </Card>
    </button>
  );
}

function CreateHolidayForm({
  template,
  onSubmit,
  onCancel,
}: {
  template: Holiday | null;
  onSubmit: (name: string, date: string, icon?: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(template?.name || "");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), date, template?.icon || undefined);
    } finally {
      setSubmitting(false);
    }
  };

  const icon = getHolidayIcon(template?.icon);

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm max-w-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-2xl">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {template ? `Add ${template.name}` : "Create Custom Holiday"}
            </h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Holiday name"
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-300">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="flex-1 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !name.trim() || !date}
              className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ActiveSection({
  holidays,
  onToggleComplete,
  onToggleArchive,
}: {
  holidays: Holiday[];
  onToggleComplete: (holiday: Holiday) => void;
  onToggleArchive?: (holiday: Holiday) => void;
}) {
  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Active Holidays</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Create a new holiday to start planning gifts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {holidays.map((holiday) => (
        <HolidayCard
          key={holiday.id}
          holiday={holiday}
          onToggleComplete={onToggleComplete}
          onToggleArchive={onToggleArchive}
        />
      ))}
    </div>
  );
}

function PastSection({
  holidays,
  onToggleComplete,
  onToggleArchive,
}: {
  holidays: Holiday[];
  onToggleComplete: (holiday: Holiday) => void;
  onToggleArchive?: (holiday: Holiday) => void;
}) {
  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
        <Archive className="h-12 w-12 mx-auto text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Past Holidays</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Holidays marked as complete will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {holidays.map((holiday) => (
        <HolidayCard
          key={holiday.id}
          holiday={holiday}
          onToggleComplete={onToggleComplete}
          onToggleArchive={onToggleArchive}
        />
      ))}
    </div>
  );
}

function ArchivedSection({
  holidays,
  onToggleArchive,
}: {
  holidays: Holiday[];
  onToggleArchive: (holiday: Holiday) => void;
}) {
  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
        <Archive className="h-12 w-12 mx-auto text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Archived Holidays</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Archived holidays will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {holidays.map((holiday) => (
        <div key={holiday.id} className="relative group">
          <Link href={`/holidays/${holiday.id}`}>
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-violet-500/50 transition-all cursor-pointer opacity-60">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-2xl">
                  {getHolidayIcon(holiday.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">{holiday.name}</h3>
                  </div>
                  {holiday.date && (
                    <p className="text-sm text-slate-400">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="w-5" />
              </CardContent>
            </Card>
          </Link>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleArchive(holiday);
              }}
              title="Unarchive"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-violet-400 transition-colors pointer-events-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewHolidaySection({
  templates,
  onCreateHoliday,
}: {
  templates: Holiday[];
  onCreateHoliday: (name: string, date: string, icon?: string) => Promise<void>;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<Holiday | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleSubmit = async (name: string, date: string, icon?: string) => {
    await onCreateHoliday(name, date, icon);
    setSelectedTemplate(null);
    setShowCustomForm(false);
  };

  if (selectedTemplate || showCustomForm) {
    return (
      <CreateHolidayForm
        template={selectedTemplate}
        onSubmit={handleSubmit}
        onCancel={() => {
          setSelectedTemplate(null);
          setShowCustomForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Choose a Template</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              holiday={template}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Or Create Your Own</h2>
        <button onClick={() => setShowCustomForm(true)} className="w-full max-w-sm">
          <Card className="border-slate-800 border-dashed bg-slate-900/30 hover:bg-slate-800/50 hover:border-violet-500/50 transition-all group cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-slate-700 group-hover:border-violet-500/50 transition-colors">
                <Pencil className="h-5 w-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                  Custom Holiday
                </h3>
                <p className="text-sm text-slate-500">Create your own</p>
              </div>
              <Plus className="h-5 w-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}

export default function HolidaysPage() {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<HolidaysSection>("active");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [templates, setTemplates] = useState<Holiday[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(AUTH_ROUTES.signIn);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      try {
        const [holidaysData, templatesData] = await Promise.all([
          holidaysService.getAll(),
          holidaysService.getTemplates(),
        ]);
        setHolidays(holidaysData);
        setTemplates(templatesData);
      } catch {
        setError("Failed to load holidays. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(AUTH_ROUTES.signIn);
  }, [signOut, router]);

  const handleCreateHoliday = async (name: string, date: string, icon?: string) => {
    const holiday = await holidaysService.create({ name, date, icon });
    setHolidays((prev) => [...prev, holiday]);
    setActiveSection("active");
    toast.success(`Created "${holiday.name}"`);
  };

  const handleToggleComplete = async (holiday: Holiday) => {
    try {
      const updated = await holidaysService.update(holiday.id, {
        completed: !holiday.completed,
      });
      setHolidays((prev) => prev.map((h) => (h.id === holiday.id ? updated : h)));
      toast.success(
        updated.completed
          ? `Marked "${updated.name}" as complete`
          : `Marked "${updated.name}" as active`
      );
    } catch {
      toast.error("Failed to update holiday");
    }
  };

  const handleToggleArchive = async (holiday: Holiday) => {
    try {
      const updated = await holidaysService.update(holiday.id, {
        archived: !holiday.archived,
      });
      setHolidays((prev) => prev.map((h) => (h.id === holiday.id ? updated : h)));
      toast.success(
        updated.archived
          ? `Archived "${updated.name}"`
          : `Unarchived "${updated.name}"`
      );
    } catch {
      toast.error("Failed to update holiday");
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeHolidays = holidays.filter((h) => !h.completed && !h.archived);
  const pastHolidays = holidays.filter((h) => h.completed && !h.archived);
  const archivedHolidays = holidays.filter((h) => h.archived);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={handleSignOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Holidays</h1>
          <p className="text-slate-400">
            Plan gifts for upcoming holidays or review past ones.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">
          <HolidaysNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            activeCounts={{ active: activeHolidays.length, past: pastHolidays.length, archived: archivedHolidays.length }}
          />

          <div className="flex-1 min-w-0">
            {activeSection === "active" && (
              <ActiveSection
                holidays={activeHolidays}
                onToggleComplete={handleToggleComplete}
                onToggleArchive={handleToggleArchive}
              />
            )}
            {activeSection === "past" && (
              <PastSection
                holidays={pastHolidays}
                onToggleComplete={handleToggleComplete}
                onToggleArchive={handleToggleArchive}
              />
            )}
            {activeSection === "archived" && (
              <ArchivedSection
                holidays={archivedHolidays}
                onToggleArchive={handleToggleArchive}
              />
            )}
            {activeSection === "new" && (
              <NewHolidaySection
                templates={templates}
                onCreateHoliday={handleCreateHoliday}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
