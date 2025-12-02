"use client";

import Link from "next/link";
import type { Person } from "@niftygifty/types";
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronRight, Gift } from "lucide-react";

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <Link href={`/people/${person.id}`}>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-violet-500/50 transition-all group cursor-pointer">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20">
            <User className="h-6 w-6 text-fuchsia-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{person.name}</h3>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              {person.relationship && (
                <span className="capitalize">{person.relationship}</span>
              )}
              {person.gift_count > 0 && (
                <span className="flex items-center gap-1 text-violet-400">
                  <Gift className="h-3 w-3" />
                  {person.gift_count}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}

