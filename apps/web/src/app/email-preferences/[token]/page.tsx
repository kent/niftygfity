"use client";

import { useState, useEffect, useCallback, use } from "react";
import { notificationPreferencesService } from "@/services";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Gift,
  TreePine,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { NotificationPreferences, EmailPreferencesResponse } from "@niftygifty/types";

interface NotificationToggle {
  id: keyof Omit<NotificationPreferences, "created_at" | "updated_at">;
  title: string;
  description: string;
  icon: typeof Gift;
}

const NOTIFICATION_TOGGLES: NotificationToggle[] = [
  {
    id: "pending_gifts_reminder_enabled",
    title: "Pending Gifts Reminder",
    description: "Get reminders about gifts that aren't wrapped or done yet",
    icon: Gift,
  },
  {
    id: "no_gifts_before_christmas_enabled",
    title: "Christmas Gift Nudge",
    description: "Get reminded to add gifts if your Christmas list is empty",
    icon: TreePine,
  },
  {
    id: "no_gift_lists_december_enabled",
    title: "December Planning Reminder",
    description: "Weekly reminders in December if you haven't created a gift list",
    icon: Calendar,
  },
];

export default function EmailPreferencesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<EmailPreferencesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await notificationPreferencesService.getByToken(token);
        setData(response);
      } catch {
        setError("This link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const handleToggle = useCallback(
    async (id: NotificationToggle["id"], checked: boolean) => {
      if (!data) return;
      setUpdating(id);
      setSaved(false);
      try {
        const updated = await notificationPreferencesService.updateByToken(token, {
          [id]: checked,
        });
        setData(updated);
        setSaved(true);
        toast.success(checked ? "Notifications enabled" : "Notifications disabled");
        setTimeout(() => setSaved(false), 2000);
      } catch {
        toast.error("Failed to update preference");
      } finally {
        setUpdating(null);
      }
    },
    [data, token]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin h-10 w-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full" />
          </div>
          <span className="text-sm text-slate-400">Loading preferences...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500">
              Go to Listy Gifty
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/5 via-transparent to-transparent" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-4">
            <Bell className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Preferences</h1>
          <p className="text-slate-400">
            Managing notifications for <span className="text-white font-medium">{data.user.email}</span>
          </p>
        </div>

        {/* Success indicator */}
        {saved && (
          <div className="mb-6 flex items-center justify-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Preferences saved</span>
          </div>
        )}

        {/* Notification Toggles */}
        <div className="space-y-4 mb-8">
          {NOTIFICATION_TOGGLES.map(({ id, title, description, icon: Icon }) => (
            <div
              key={id}
              className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/50"
            >
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 shrink-0">
                    <Icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {updating === id && (
                      <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                    )}
                    <Switch
                      checked={data.preferences[id]}
                      onCheckedChange={(checked) => handleToggle(id, checked)}
                      disabled={updating !== null}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-600 data-[state=checked]:to-fuchsia-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-4">
            Changes are saved automatically
          </p>
          <Link href="/holidays">
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Listy Gifty
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer brand */}
      <footer className="relative z-10 py-8 text-center">
        <p className="text-xs text-slate-600">
          🎁 Listy Gifty • Made with ❤️ for gift givers everywhere
        </p>
      </footer>
    </div>
  );
}

