"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useGiftFilters } from "@/hooks";
import { holidaysService, giftsService, peopleService, giftStatusesService } from "@/services";
import { AppHeader } from "@/components/layout";
import { GiftFilters } from "@/components/filters";
import { GiftGrid, HolidayReports } from "@/components/gifts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Gift as GiftIcon, BarChart3 } from "lucide-react";
import type { Holiday, Gift, Person, GiftStatus } from "@niftygifty/types";

function getHolidayIcon(icon?: string | null) {
  const icons: Record<string, string> = {
    christmas: "🎄",
    hanukkah: "🕎",
    diwali: "🪔",
    easter: "🐰",
    birthday: "🎂",
    thanksgiving: "🦃",
    valentines: "💝",
    mothers_day: "💐",
    fathers_day: "👔",
  };
  return icon ? icons[icon] || "🎁" : "🎁";
}

export default function HolidayDetailPage() {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const holidayId = Number(params.id);

  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [statuses, setStatuses] = useState<GiftStatus[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    filters,
    filteredGifts,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useGiftFilters(gifts);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !holidayId) return;

    async function loadData() {
      try {
        const [holidayData, holidaysData, giftsData, peopleData, statusesData] = await Promise.all([
          holidaysService.getById(holidayId),
          holidaysService.getAll(),
          giftsService.getAll(),
          peopleService.getAll(),
          giftStatusesService.getAll(),
        ]);
        setHoliday(holidayData);
        setHolidays(holidaysData);
        setGifts(giftsData.filter((g) => g.holiday_id === holidayId));
        setPeople(peopleData);
        setStatuses(statusesData);
      } catch {
        setError("Failed to load holiday. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, holidayId]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !holiday) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Holiday not found"}</p>
          <Link href="/holidays">
            <Button>Back to Holidays</Button>
          </Link>
        </div>
      </div>
    );
  }

  const icon = getHolidayIcon(holiday.icon);
  const formattedDate = new Date(holiday.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={handleSignOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Holidays
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{holiday.name}</h1>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {statuses.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
            <GiftIcon className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Gift Statuses</h2>
            <p className="text-slate-400 mb-4">
              Create gift statuses (e.g., Idea, Ordered, Delivered) to start tracking gifts.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="gifts" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="gifts" className="gap-2">
                <GiftIcon className="h-4 w-4" />
                Gifts
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gifts" className="space-y-4">
              <GiftFilters
                filters={filters}
                statuses={statuses}
                people={people}
                onSearchChange={(v) => updateFilter("search", v)}
                onStatusChange={(ids) => updateFilter("statusIds", ids)}
                onRecipientChange={(ids) => updateFilter("recipientIds", ids)}
                onGiverChange={(ids) => updateFilter("giverIds", ids)}
                onCostRangeChange={(r) => updateFilter("costRange", r)}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                totalCount={gifts.length}
                filteredCount={filteredGifts.length}
              />
              <GiftGrid
                gifts={filteredGifts}
                people={people}
                statuses={statuses}
                holidays={holidays}
                defaultHolidayId={holidayId}
                defaultStatusId={statuses[0]?.id}
                onGiftsChange={setGifts}
                onPeopleChange={setPeople}
              />
            </TabsContent>
            <TabsContent value="reports">
              <HolidayReports
                gifts={gifts}
                people={people}
                statuses={statuses}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

