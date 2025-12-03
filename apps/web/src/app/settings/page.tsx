"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { giftStatusesService, AUTH_ROUTES } from "@/services";
import { AppHeader } from "@/components/layout";
import {
  GiftStatusSection,
  ProfileSection,
  BillingSection,
  SettingsNav,
  type SettingsSection,
} from "@/components/settings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { GiftStatus } from "@niftygifty/types";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [statuses, setStatuses] = useState<GiftStatus[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(AUTH_ROUTES.signIn);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      try {
        const data = await giftStatusesService.getAll();
        setStatuses(data);
      } catch {
        setError("Failed to load settings. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(AUTH_ROUTES.signIn);
  }, [signOut, router]);

  const handleAddStatus = useCallback(async (name: string) => {
    const nextPosition = statuses.length > 0
      ? Math.max(...statuses.map((s) => s.position)) + 1
      : 1;
    const status = await giftStatusesService.create({ name, position: nextPosition });
    setStatuses((prev) => [...prev, status]);
    toast.success(`Created "${status.name}" status`);
  }, [statuses]);

  const handleDeleteStatus = useCallback(async (status: GiftStatus) => {
    await giftStatusesService.delete(status.id);
    setStatuses((prev) => prev.filter((s) => s.id !== status.id));
    toast.success(`Deleted "${status.name}" status`);
  }, []);

  const handleReorderStatus = useCallback(async (statusId: number, newPosition: number) => {
    const status = await giftStatusesService.update(statusId, { position: newPosition });
    setStatuses((prev) =>
      prev.map((s) => (s.id === statusId ? status : s)).sort((a, b) => a.position - b.position)
    );
  }, []);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={handleSignOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">
            Customize NiftyGifty to fit your workflow.
          </p>
        </div>

        <div className="flex gap-8">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 max-w-2xl">
            {activeSection === "profile" && (
              <ProfileSection user={user} />
            )}
            {activeSection === "statuses" && (
              <GiftStatusSection
                statuses={statuses}
                onAdd={handleAddStatus}
                onDelete={handleDeleteStatus}
                onReorder={handleReorderStatus}
              />
            )}
            {activeSection === "billing" && (
              <BillingSection />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
