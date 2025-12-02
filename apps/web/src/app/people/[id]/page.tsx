"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { peopleService, giftSuggestionsService } from "@/services";
import { AppHeader } from "@/components/layout";
import { GiftSuggestionsTab } from "@/components/gift-suggestions-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Gift as GiftIcon,
  Calendar,
  ExternalLink,
  DollarSign,
  Package,
  Heart,
  Sparkles,
} from "lucide-react";
import type { PersonWithGifts, Gift, Holiday, RelationshipCategory, GiftSuggestion } from "@niftygifty/types";
import { RELATIONSHIP_CATEGORIES } from "@niftygifty/types";
import { cn } from "@/lib/utils";

type NavTab = "received" | "giving" | "holidays" | "suggestions";

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

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupGiftsByHolidayDescending(gifts: Gift[]): Map<Holiday, Gift[]> {
  const grouped = new Map<number, { holiday: Holiday; gifts: Gift[] }>();
  
  for (const gift of gifts) {
    const key = gift.holiday_id;
    if (!grouped.has(key)) {
      grouped.set(key, { holiday: gift.holiday, gifts: [] });
    }
    grouped.get(key)!.gifts.push(gift);
  }
  
  // Sort by holiday date descending
  const sorted = Array.from(grouped.values()).sort((a, b) => {
    const dateA = a.holiday.date ? new Date(a.holiday.date).getTime() : 0;
    const dateB = b.holiday.date ? new Date(b.holiday.date).getTime() : 0;
    return dateB - dateA;
  });
  
  return new Map(sorted.map(({ holiday, gifts }) => [holiday, gifts]));
}

function GiftCard({ gift }: { gift: Gift }) {
  const cost = gift.cost ? parseFloat(gift.cost) : null;
  
  return (
    <div className="group p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{gift.name}</h4>
          {gift.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{gift.description}</p>
          )}
        </div>
        {gift.link && (
          <a
            href={gift.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-violet-400 transition-colors shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        <Badge
          variant="secondary"
          className="bg-slate-700/50 text-slate-300 border-0"
        >
          {gift.gift_status.name}
        </Badge>
        {cost !== null && (
          <span className="text-sm text-emerald-400 flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {cost.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

function HolidayGiftGroup({ holiday, gifts }: { holiday: Holiday; gifts: Gift[] }) {
  const icon = getHolidayIcon(holiday.icon);
  const totalCost = gifts.reduce((sum, g) => sum + (g.cost ? parseFloat(g.cost) : 0), 0);
  
  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <CardTitle className="text-lg text-white">{holiday.name}</CardTitle>
              {holiday.date && (
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(holiday.date)}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">{gifts.length} gift{gifts.length !== 1 ? "s" : ""}</div>
            {totalCost > 0 && (
              <div className="text-sm text-emerald-400">${totalCost.toFixed(2)}</div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GiftSection({ gifts, emptyMessage }: { gifts: Gift[]; emptyMessage: string }) {
  const groupedGifts = useMemo(() => groupGiftsByHolidayDescending(gifts), [gifts]);
  
  if (gifts.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/30">
        <CardContent className="py-8 text-center">
          <GiftIcon className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(groupedGifts.entries()).map(([holiday, holidayGifts]) => (
        <HolidayGiftGroup key={holiday.id} holiday={holiday} gifts={holidayGifts} />
      ))}
    </div>
  );
}

function HolidaysSection({ holidays }: { holidays: Holiday[] }) {
  if (holidays.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/30">
        <CardContent className="py-8 text-center">
          <Sparkles className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500">No holidays associated with this person yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {holidays.map((holiday) => {
        const icon = getHolidayIcon(holiday.icon);
        return (
          <Card key={holiday.id} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="font-medium text-white">{holiday.name}</h3>
                {holiday.date && (
                  <div className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {formatDate(holiday.date)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RelationshipSelector({
  current,
  onSelect,
  disabled,
}: {
  current: string | null;
  onSelect: (category: RelationshipCategory) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RELATIONSHIP_CATEGORIES.map((category) => {
        const isSelected = current === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            disabled={disabled}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
              "border focus:outline-none focus:ring-2 focus:ring-violet-500/50",
              isSelected
                ? "bg-violet-600 border-violet-500 text-white"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function VerticalNav({
  activeTab,
  onTabChange,
  receivedCount,
  givingCount,
  holidaysCount,
  suggestionsCount,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  receivedCount: number;
  givingCount: number;
  holidaysCount: number;
  suggestionsCount: number;
}) {
  const tabs: { id: NavTab; label: string; icon: typeof Package; count: number }[] = [
    { id: "received", label: "Received", icon: Package, count: receivedCount },
    { id: "giving", label: "Giving", icon: Heart, count: givingCount },
    { id: "holidays", label: "Holidays", icon: Sparkles, count: holidaysCount },
    { id: "suggestions", label: "Suggestions", icon: Sparkles, count: suggestionsCount },
  ];

  return (
    <nav className="flex flex-col gap-1 w-full">
      {tabs.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
            activeTab === id
              ? "bg-violet-600/20 border border-violet-500/50 text-white"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent"
          )}
        >
          <Icon className={cn("h-5 w-5", activeTab === id ? "text-violet-400" : "")} />
          <span className="font-medium">{label}</span>
          <span className={cn(
            "ml-auto text-xs px-2 py-0.5 rounded-full",
            activeTab === id 
              ? "bg-violet-500/30 text-violet-300" 
              : "bg-slate-700/50 text-slate-500"
          )}>
            {count}
          </span>
        </button>
      ))}
    </nav>
  );
}

export default function PersonDetailPage() {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const personId = Number(params.id);

  const [person, setPerson] = useState<PersonWithGifts | null>(null);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>("received");
  const [updatingRelationship, setUpdatingRelationship] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !personId) return;

    async function loadData() {
      try {
        const [personData, suggestionsData] = await Promise.all([
          peopleService.getWithGifts(personId),
          giftSuggestionsService.getAll(personId),
        ]);
        setPerson(personData);
        setSuggestions(suggestionsData);
      } catch {
        setError("Failed to load person. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, personId]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleRelationshipSelect = async (category: RelationshipCategory) => {
    if (!person || updatingRelationship) return;
    
    setUpdatingRelationship(true);
    try {
      const updated = await peopleService.update(personId, { relationship: category });
      setPerson({ ...person, relationship: updated.relationship });
    } catch {
      // Silently fail - user can try again
    } finally {
      setUpdatingRelationship(false);
    }
  };

  // Extract unique holidays from all gifts (received + given), sorted descending by date
  const uniqueHolidays = useMemo(() => {
    if (!person) return [];
    
    const holidayMap = new Map<number, Holiday>();
    
    for (const gift of person.gifts_received) {
      if (!holidayMap.has(gift.holiday_id)) {
        holidayMap.set(gift.holiday_id, gift.holiday);
      }
    }
    for (const gift of person.gifts_given) {
      if (!holidayMap.has(gift.holiday_id)) {
        holidayMap.set(gift.holiday_id, gift.holiday);
      }
    }
    
    return Array.from(holidayMap.values()).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [person]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Person not found"}</p>
          <Link href="/people">
            <Button>Back to People</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalReceiving = person.gifts_received.reduce(
    (sum, g) => sum + (g.cost ? parseFloat(g.cost) : 0),
    0
  );
  const totalGiving = person.gifts_given.reduce(
    (sum, g) => sum + (g.cost ? parseFloat(g.cost) : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={handleSignOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to People
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20">
              <User className="h-7 w-7 text-fuchsia-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{person.name}</h1>
              {person.relationship && (
                <span className="text-sm text-slate-400 capitalize">{person.relationship}</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <Card className="border-slate-800 bg-slate-900/30">
              <CardContent className="p-4 flex items-center gap-3">
                <Package className="h-5 w-5 text-violet-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{person.gifts_received.length}</div>
                  <div className="text-xs text-slate-500">Receiving</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/30">
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-2xl font-bold text-white">${totalReceiving.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">Total Cost</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/30">
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{person.gifts_given.length}</div>
                  <div className="text-xs text-slate-500">Giving</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/30">
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-2xl font-bold text-white">${totalGiving.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">Given Value</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relationship Selector */}
          <div className="mt-6">
            <label className="block text-sm text-slate-400 mb-2">Category</label>
            <RelationshipSelector
              current={person.relationship}
              onSelect={handleRelationshipSelect}
              disabled={updatingRelationship}
            />
          </div>
        </div>

        {/* Main Content: Sidebar Nav + Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vertical Nav */}
          <div className="lg:w-48 shrink-0">
            <VerticalNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              receivedCount={person.gifts_received.length}
              givingCount={person.gifts_given.length}
              holidaysCount={uniqueHolidays.length}
              suggestionsCount={suggestions.length}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "received" && (
              <GiftSection
                gifts={person.gifts_received}
                emptyMessage="No gifts assigned to this person yet"
              />
            )}
            {activeTab === "giving" && (
              <GiftSection
                gifts={person.gifts_given}
                emptyMessage="This person isn't giving any gifts yet"
              />
            )}
            {activeTab === "holidays" && (
              <HolidaysSection holidays={uniqueHolidays} />
            )}
            {activeTab === "suggestions" && (
              <GiftSuggestionsTab
                personId={personId}
                personName={person.name}
                suggestions={suggestions}
                onSuggestionsChange={setSuggestions}
                user={user}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
