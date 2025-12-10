"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@niftygifty/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Users, Settings, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface AppHeaderProps {
  user: User | null;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { href: "/holidays", label: "Holidays", icon: Calendar },
  { href: "/people", label: "People", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppHeader({ user, onSignOut }: AppHeaderProps) {
  const pathname = usePathname();
  const { isPremium, billingStatus } = useAuth();

  return (
    <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Listy Gifty</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Premium badge or upgrade button */}
          {isPremium ? (
            <Link href="/billing">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white cursor-pointer hover:opacity-90 transition-opacity">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </Link>
          ) : billingStatus ? (
            <Link href="/billing">
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
              >
                <Sparkles className="w-3 h-3" />
                Upgrade
              </Button>
            </Link>
          ) : null}
          {user && <span className="text-sm text-slate-400 hidden sm:inline">{user.email}</span>}
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

