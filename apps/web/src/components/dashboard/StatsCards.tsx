"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Gift, ArrowRight } from "lucide-react";

interface StatsCardsProps {
  holidayCount: number;
  peopleCount: number;
}

export function StatsCards({ holidayCount, peopleCount }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Active Holidays
          </CardTitle>
          <Calendar className="h-4 w-4 text-violet-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{holidayCount}</div>
          <p className="text-xs text-slate-500">
            {holidayCount === 0 ? "Choose a holiday below" : "Planning in progress"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            People
          </CardTitle>
          <Users className="h-4 w-4 text-fuchsia-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{peopleCount}</div>
          <p className="text-xs text-slate-500">
            {peopleCount === 0 ? "Add people below" : "On your gift list"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Gift Tracker
          </CardTitle>
          <Gift className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <Link href="/gifts">
            <Button
              variant="ghost"
              className="p-0 h-auto text-2xl font-bold text-white hover:text-violet-400 transition-colors"
            >
              Open <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-slate-500">Track all your gifts</p>
        </CardContent>
      </Card>
    </div>
  );
}

