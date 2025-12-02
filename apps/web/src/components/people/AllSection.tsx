"use client";

import { useMemo, useState } from "react";
import type { Person } from "@niftygifty/types";
import { PeopleList } from "./PeopleList";
import { RelationshipFilter, type RelationshipFilterValue } from "./RelationshipFilter";

interface AllSectionProps {
  people: Person[];
}

export function AllSection({ people }: AllSectionProps) {
  const [filter, setFilter] = useState<RelationshipFilterValue>("all");

  const filteredPeople = useMemo(() => {
    let result = [...people];

    // Filter by relationship
    if (filter !== "all") {
      result = result.filter((p) => {
        if (filter === "other") {
          return !p.relationship || p.relationship === "other";
        }
        return p.relationship === filter;
      });
    }

    // Sort alphabetically
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [people, filter]);

  return (
    <div>
      <RelationshipFilter value={filter} onChange={setFilter} />
      <PeopleList
        people={filteredPeople}
        emptyTitle="No People Found"
        emptyDescription={
          filter === "all"
            ? "Add someone to your gift list to get started"
            : `No people in the "${filter}" category`
        }
      />
    </div>
  );
}

