"use client";

import { useMemo } from "react";
import type { Person } from "@niftygifty/types";
import { PeopleList } from "./PeopleList";

interface FamilySectionProps {
  people: Person[];
}

export function FamilySection({ people }: FamilySectionProps) {
  const familyPeople = useMemo(() => {
    return people
      .filter((p) => p.relationship === "family")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [people]);

  return (
    <PeopleList
      people={familyPeople}
      emptyTitle="No Family Members"
      emptyDescription="Add family members to your gift list and categorize them as 'Family'"
    />
  );
}

