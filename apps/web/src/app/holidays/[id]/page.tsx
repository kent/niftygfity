"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useGiftFilters } from "@/hooks";
import { holidaysService, giftsService, peopleService, giftStatusesService, AUTH_ROUTES } from "@/services";
import { AppHeader } from "@/components/layout";
import { GiftFilters } from "@/components/filters";
import { GiftGrid, HolidayReports } from "@/components/gifts";
import { ShareHolidayDialog } from "@/components/holidays";
import { CursorOverlay } from "@/components/cursors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Gift as GiftIcon, BarChart3, Users, Scale } from "lucide-react";
import type { Holiday, Gift, Person, GiftStatus, HolidayCollaborator } from "@niftygifty/types";

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

function getCollaboratorName(collab: HolidayCollaborator): string {
  if (collab.first_name || collab.last_name) {
    return [collab.first_name, collab.last_name].filter(Boolean).join(" ");
  }
  if (collab.email.includes("@clerk.user")) {
    return "Anonymous user";
  }
  return collab.email;
}

function getCollaboratorInitials(collab: HolidayCollaborator): string {
  if (collab.first_name) {
    const first = collab.first_name[0];
    const last = collab.last_name?.[0] || "";
    return (first + last).toUpperCase();
  }
  if (!collab.email.includes("@clerk.user")) {
    return collab.email[0].toUpperCase();
  }
  return "?";
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
  const [collaborators, setCollaborators] = useState<HolidayCollaborator[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [collaboratorsLoading, setCollaboratorsLoading] = useState(true);
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
      router.push(AUTH_ROUTES.signIn);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !holidayId) return;

    async function loadData() {
      try {
        const [
          holidayData,
          holidaysData,
          giftsData,
          peopleData,
          statusesData,
          collaboratorsData,
        ] = await Promise.all([
          holidaysService.getById(holidayId),
          holidaysService.getAll(),
          giftsService.getAll(),
          peopleService.getAll(),
          giftStatusesService.getAll(),
          holidaysService.getCollaborators(holidayId),
        ]);
        setHoliday(holidayData);
        setHolidays(holidaysData);
        setGifts(giftsData.filter((g) => g.holiday_id === holidayId));
        setPeople(peopleData);
        setStatuses(statusesData);
        setCollaborators(collaboratorsData);
      } catch {
        setError("Failed to load holiday. Please try again.");
      } finally {
        setDataLoading(false);
        setCollaboratorsLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, holidayId]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(AUTH_ROUTES.signIn);
  }, [signOut, router]);

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
  const formattedDate = holiday.date
    ? new Date(holiday.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const collaboratorPeers = collaborators.filter((c) => c.role !== "owner");
  const collaboratorJoinCount = Math.max(collaborators.length - 1, 0);

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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{holiday.name}</h1>
                  {holiday.collaborator_count > 1 && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {holiday.collaborator_count}
                    </Badge>
                  )}
                  {!holiday.is_owner && holiday.role === "collaborator" && (
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      Shared with you
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {collaboratorsLoading ? (
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                  ) : collaboratorJoinCount > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="h-4 w-4" />
                        <span>
                          {collaboratorJoinCount} {collaboratorJoinCount === 1 ? "person" : "people"} joined
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {collaboratorPeers.slice(0, 3).map((collab) =>
                          collab.image_url ? (
                            <img
                              key={collab.user_id}
                              src={collab.image_url}
                              alt={getCollaboratorName(collab)}
                              className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover"
                            />
                          ) : (
                            <div
                              key={collab.user_id}
                              className="h-8 w-8 rounded-full bg-violet-500/20 border-2 border-slate-900 flex items-center justify-center text-xs font-semibold text-violet-200"
                            >
                              {getCollaboratorInitials(collab)}
                            </div>
                          )
                        )}
                        {collaboratorPeers.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-300">
                            +{collaboratorPeers.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>No collaborators yet — share your link.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/match/${holidayId}`}>
                <Button variant="outline" className="gap-2">
                  <Scale className="h-4 w-4" />
                  Match Gifts
                </Button>
              </Link>
              <ShareHolidayDialog holiday={holiday} />
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

      <CursorOverlay holidayId={holidayId} />
    </div>
  );
}

