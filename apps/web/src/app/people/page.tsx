"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { peopleService } from "@/services";
import { AppHeader } from "@/components/layout";
import {
  PeopleNav,
  AllSection,
  FavouritesSection,
  RecentSection,
  FamilySection,
  NewPersonModal,
  type PeopleSection,
} from "@/components/people";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Person } from "@niftygifty/types";

export default function PeoplePage() {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<PeopleSection>("all");
  const [people, setPeople] = useState<Person[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      try {
        const data = await peopleService.getAll();
        setPeople(data);
      } catch {
        setError("Failed to load people. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleAddPerson = useCallback(async (name: string, relationship?: string) => {
    const person = await peopleService.create({ name, relationship });
    setPeople((prev) => [...prev, person]);
    toast.success(`Added ${person.name} to your gift list!`);
  }, []);

  const handleSectionChange = (section: PeopleSection) => {
    if (section === "new") {
      setModalOpen(true);
    } else {
      setActiveSection(section);
    }
  };

  const counts = useMemo(() => ({
    all: people.length,
    favourites: people.filter((p) => p.gift_count > 0).length,
    recent: people.length,
    family: people.filter((p) => p.relationship === "family").length,
  }), [people]);

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
          <h1 className="text-3xl font-bold text-white mb-2">People</h1>
          <p className="text-slate-400">
            Manage everyone on your gift list. Add family, friends, and colleagues.
          </p>
        </div>

        <div className="flex gap-8">
          <PeopleNav
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            counts={counts}
          />

          <div className="flex-1">
            {activeSection === "all" && <AllSection people={people} />}
            {activeSection === "favourites" && <FavouritesSection people={people} />}
            {activeSection === "recent" && <RecentSection people={people} />}
            {activeSection === "family" && <FamilySection people={people} />}
          </div>
        </div>
      </main>

      <NewPersonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddPerson}
      />
    </div>
  );
}
