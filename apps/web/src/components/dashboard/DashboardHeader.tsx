"use client";

import type { User } from "@niftygifty/types";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface DashboardHeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Listy Gifty</span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-slate-400">{user.email}</span>}
          <Button
            variant="outline"
            onClick={onSignOut}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}

