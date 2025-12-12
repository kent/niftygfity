"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@niftygifty/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Gift, Calendar, Users, Settings, Crown, Sparkles, Menu, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface AppHeaderProps {
  user: User | null;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/holidays", label: "Gift Lists", icon: Calendar },
  { href: "/people", label: "People", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppHeader({ user, onSignOut }: AppHeaderProps) {
  const pathname = usePathname();
  const { isPremium, billingStatus } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile menu button */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 border-slate-800 w-72">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  Listy Gifty
                </SheetTitle>
              </SheetHeader>
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-violet-500/20 text-violet-300"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                {/* Premium/Upgrade in mobile nav */}
                {isPremium ? (
                  <Link href="/billing" onClick={() => setMobileNavOpen(false)}>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white w-full justify-center py-2">
                      <Crown className="w-4 h-4 mr-2" />
                      Premium Member
                    </Badge>
                  </Link>
                ) : billingStatus ? (
                  <Link href="/billing" onClick={() => setMobileNavOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                ) : null}
                {user && (
                  <p className="text-sm text-slate-400 px-4 truncate">{user.email}</p>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileNavOpen(false);
                    onSignOut();
                  }}
                  className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2 md:gap-3">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Gift className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-white">Listy Gifty</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.filter(item => item.href !== "/dashboard").map(({ href, label, icon: Icon }) => {
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

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-4">
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
          {user && <span className="text-sm text-slate-400">{user.email}</span>}
          <Button
            variant="outline"
            onClick={onSignOut}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </Button>
        </div>

        {/* Mobile: just show premium badge if applicable */}
        <div className="flex md:hidden items-center gap-2">
          {isPremium && (
            <Link href="/billing">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white text-xs">
                <Crown className="w-3 h-3" />
              </Badge>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

