"use client";

import { useMemo } from "react";
import type { Person } from "@niftygifty/types";
import { PeopleList } from "./PeopleList";

interface SharedSectionProps {
  people: Person[];
}

export function SharedSection({ people }: SharedSectionProps) {
  const sharedPeople = useMemo(() => {
    return people
      .filter((p) => p.is_shared)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [people]);

  return (
    <PeopleList
      people={sharedPeople}
      emptyTitle="No Shared People"
      emptyDescription="People shared with you through gift lists will appear here"
    />
  );
}

