"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { holidaysService, peopleService, AUTH_ROUTES } from "@/services";
import {
  StatsCards,
  HolidayTemplatesSection,
  PeopleSection,
} from "@/components/dashboard";
import { AppHeader } from "@/components/layout";
import { toast } from "sonner";
import type { Holiday, Person } from "@niftygifty/types";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();

  const [templates, setTemplates] = useState<Holiday[]>([]);
  const [userHolidays, setUserHolidays] = useState<Holiday[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [creatingHolidayId, setCreatingHolidayId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [templatesData, holidaysData, peopleData] = await Promise.all([
        holidaysService.getTemplates(),
        holidaysService.getAll(),
        peopleService.getAll(),
      ]);
      setTemplates(templatesData);
      setUserHolidays(holidaysData);
      setPeople(peopleData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(AUTH_ROUTES.signIn);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toast.success("Signed out", {
      description: "You've been signed out successfully.",
    });
    router.push(AUTH_ROUTES.signIn);
  }, [signOut, router]);

  const handleStartPlanning = async (template: Holiday) => {
    setCreatingHolidayId(template.id);
    try {
      const currentYear = new Date().getFullYear();
      const newHoliday = await holidaysService.create({
        name: `${template.name} ${currentYear}`,
        date: new Date().toISOString().split("T")[0],
        icon: template.icon || undefined,
      });
      setUserHolidays((prev) => [...prev, newHoliday]);
      toast.success(`Started planning ${template.name} ${currentYear}!`);
    } catch {
      toast.error("Failed to create holiday");
    } finally {
      setCreatingHolidayId(null);
    }
  };

  const handleAddPerson = async (name: string, relationship?: string) => {
    const person = await peopleService.create({ name, relationship });
    setPeople((prev) => [...prev, person]);
    toast.success(`Added ${person.name} to your gift list!`);
  };

  const handleDeletePerson = async (person: Person) => {
    await peopleService.delete(person.id);
    setPeople((prev) => prev.filter((p) => p.id !== person.id));
    toast.success(`Removed ${person.name}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={handleSignOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Start planning your gifts by choosing a holiday and adding people to
            your list.
          </p>
        </div>

        <StatsCards
          holidayCount={userHolidays.length}
          peopleCount={people.length}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <HolidayTemplatesSection
            templates={templates}
            userHolidays={userHolidays}
            isLoading={loadingData}
            creatingHolidayId={creatingHolidayId}
            onStartPlanning={handleStartPlanning}
          />

          <PeopleSection
            people={people}
            onAddPerson={handleAddPerson}
            onDeletePerson={handleDeletePerson}
          />
        </div>
      </main>
    </div>
  );
}
