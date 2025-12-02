"use client";

import { useMemo, useState } from "react";
import type { Person } from "@niftygifty/types";
import { PeopleList } from "./PeopleList";
import { RelationshipFilter, type RelationshipFilterValue } from "./RelationshipFilter";

interface RecentSectionProps {
  people: Person[];
}

export function RecentSection({ people }: RecentSectionProps) {
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

    // Sort by updated_at (most recent first)
    return result.sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [people, filter]);

  return (
    <div>
      <RelationshipFilter value={filter} onChange={setFilter} />
      <PeopleList
        people={filteredPeople}
        emptyTitle="No Recent Activity"
        emptyDescription={
          filter === "all"
            ? "Recently updated people will appear here"
            : `No recent activity in the "${filter}" category`
        }
      />
    </div>
  );
}

