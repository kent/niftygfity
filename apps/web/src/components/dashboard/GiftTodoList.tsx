"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ExternalLink, ShoppingCart, Truck, Package } from "lucide-react";
import type { Gift, Holiday } from "@niftygifty/types";

interface GiftTodoListProps {
  gifts: Gift[];
  holidays: Holiday[];
  loading?: boolean;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  "Idea": <Circle className="h-3.5 w-3.5" />,
  "Purchased": <ShoppingCart className="h-3.5 w-3.5" />,
  "In Transit": <Truck className="h-3.5 w-3.5" />,
  "Delivered": <Package className="h-3.5 w-3.5" />,
  "Done": <CheckCircle2 className="h-3.5 w-3.5" />,
};

const STATUS_COLORS: Record<string, string> = {
  "Idea": "bg-slate-500/20 text-slate-300 border-slate-500/30",
  "Purchased": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "In Transit": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Delivered": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Done": "bg-green-500/20 text-green-300 border-green-500/30",
};

export function GiftTodoList({ gifts, holidays, loading }: GiftTodoListProps) {
  // Filter to incomplete gifts (not "Done") from active holidays only
  const todoGifts = useMemo(() => {
    const activeHolidayIds = new Set(
      holidays.filter((h) => !h.completed && !h.archived).map((h) => h.id)
    );
    return gifts.filter(
      (g) =>
        g.gift_status.name.toLowerCase() !== "done" &&
        activeHolidayIds.has(g.holiday_id)
    );
  }, [gifts, holidays]);

  // Group by holiday
  const giftsByHoliday = useMemo(() => {
    const grouped = new Map<number, { holiday: Holiday; gifts: Gift[] }>();
    for (const gift of todoGifts) {
      const holiday = holidays.find((h) => h.id === gift.holiday_id);
      if (!holiday) continue;
      if (!grouped.has(holiday.id)) {
        grouped.set(holiday.id, { holiday, gifts: [] });
      }
      grouped.get(holiday.id)!.gifts.push(gift);
    }
    // Sort gifts within each holiday by status position
    for (const group of grouped.values()) {
      group.gifts.sort((a, b) => a.gift_status.position - b.gift_status.position);
    }
    return Array.from(grouped.values());
  }, [todoGifts, holidays]);

  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white">Gift To-Do</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todoGifts.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white">Gift To-Do</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            All gifts are done! 🎉
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-white">Gift To-Do</CardTitle>
          <Badge variant="secondary" className="bg-violet-500/20 text-violet-300">
            {todoGifts.length} remaining
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {giftsByHoliday.map(({ holiday, gifts: holidayGifts }) => (
            <div key={holiday.id}>
              <Link
                href={`/holidays/${holiday.id}`}
                className="text-xs font-medium text-slate-400 hover:text-violet-300 transition-colors flex items-center gap-1 mb-2"
              >
                {holiday.name}
                <ExternalLink className="h-3 w-3" />
              </Link>
              <ul className="space-y-1.5">
                {holidayGifts.map((gift) => (
                  <li key={gift.id}>
                    <Link
                      href={`/holidays/${holiday.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                    >
                      <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[gift.gift_status.name] || STATUS_COLORS["Idea"]}`}>
                        {STATUS_ICONS[gift.gift_status.name] || STATUS_ICONS["Idea"]}
                        {gift.gift_status.name}
                      </span>
                      <span className="text-sm text-slate-200 group-hover:text-white truncate flex-1">
                        {gift.name}
                      </span>
                      {gift.recipients.length > 0 && (
                        <span className="text-xs text-slate-500 truncate max-w-[100px]">
                          → {gift.recipients.map((r) => r.name).join(", ")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
