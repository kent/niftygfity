"use client";

import { useState, useCallback, useMemo } from "react";
import { peopleService } from "@/services";
import { useWorkspaceData } from "@/hooks";
import { AppHeader } from "@/components/layout";
import {
  PeopleNav,
  AllSection,
  FavouritesSection,
  RecentSection,
  FamilySection,
  SharedSection,
  NewPersonModal,
  type PeopleSection,
} from "@/components/people";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Person } from "@niftygifty/types";

export default function PeoplePage() {
  const {
    data: people,
    setData: setPeople,
    isLoading,
    error,
    user,
    signOut,
  } = useWorkspaceData<Person[]>({
    fetcher: () => peopleService.getAll(),
    initialData: [],
  });

  const [activeSection, setActiveSection] = useState<PeopleSection>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddPerson = useCallback(async (name: string, relationship?: string) => {
    const person = await peopleService.create({ name, relationship });
    setPeople((prev) => [...prev, person]);
    toast.success(`Added ${person.name} to your gift list!`);
  }, [setPeople]);

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
    shared: people.filter((p) => p.is_shared).length,
  }), [people]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/5 dark:from-violet-900/10 via-transparent to-transparent" />

      <AppHeader user={user} onSignOut={signOut} />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">People</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage everyone on your gift list. Add family, friends, and colleagues.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">
          <PeopleNav
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            counts={counts}
          />

          <div className="flex-1 min-w-0">
            {activeSection === "all" && <AllSection people={people} />}
            {activeSection === "favourites" && <FavouritesSection people={people} />}
            {activeSection === "recent" && <RecentSection people={people} />}
            {activeSection === "family" && <FamilySection people={people} />}
            {activeSection === "shared" && <SharedSection people={people} />}
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
