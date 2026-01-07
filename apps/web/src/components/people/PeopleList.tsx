"use client";

import type { Person } from "@niftygifty/types";
import { PersonCard } from "./PersonCard";
import { Users } from "lucide-react";

interface PeopleListProps {
  people: Person[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function PeopleList({
  people,
  emptyTitle = "No People Found",
  emptyDescription = "Add someone to your gift list to get started"
}: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center">
        <Users className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{emptyTitle}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}

