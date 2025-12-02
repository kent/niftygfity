"use client";

import Link from "next/link";
import type { Holiday } from "@niftygifty/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HolidayTemplateCard } from "@/components/holidays";
import { Calendar, ArrowRight } from "lucide-react";

interface HolidayTemplatesSectionProps {
  templates: Holiday[];
  userHolidays: Holiday[];
  isLoading: boolean;
  creatingHolidayId: number | null;
  onStartPlanning: (template: Holiday) => void;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-slate-800 bg-slate-900/50 animate-pulse">
          <CardContent className="p-4">
            <div className="h-10 w-10 rounded-lg bg-slate-800 mb-3" />
            <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
            <div className="h-8 w-full bg-slate-800 rounded mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function HolidayTemplatesSection({
  templates,
  userHolidays,
  isLoading,
  creatingHolidayId,
  onStartPlanning,
}: HolidayTemplatesSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-violet-400" />
        <h2 className="text-xl font-semibold text-white">
          Start Planning a Holiday
        </h2>
      </div>
      <p className="text-slate-400 text-sm mb-4">
        Choose a holiday to start planning gifts for this year.
      </p>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template) => (
            <HolidayTemplateCard
              key={template.id}
              holiday={template}
              onStartPlanning={onStartPlanning}
              isLoading={creatingHolidayId === template.id}
            />
          ))}
        </div>
      )}

      {userHolidays.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Your Active Holidays
          </h3>
          <div className="flex flex-wrap gap-2">
            {userHolidays.map((holiday) => (
              <Link key={holiday.id} href={`/gifts?holiday=${holiday.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-500/50 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200"
                >
                  {holiday.name}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

