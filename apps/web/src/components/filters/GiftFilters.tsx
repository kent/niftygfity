"use client";

import { useState } from "react";
import { Users, Tag, UserCheck, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";
import { CostRangeFilter } from "./CostRangeFilter";
import { SearchFilter } from "./SearchFilter";
import type { GiftFilterState, GiftStatus, Person, CostRange } from "@niftygifty/types";
import { cn } from "@/lib/utils";

interface GiftFiltersProps {
  filters: GiftFilterState;
  statuses: GiftStatus[];
  people: Person[];
  onSearchChange: (search: string) => void;
  onStatusChange: (ids: number[]) => void;
  onRecipientChange: (ids: number[]) => void;
  onGiverChange: (ids: number[]) => void;
  onCostRangeChange: (range: CostRange | null) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export function GiftFilters({
  filters,
  statuses,
  people,
  onSearchChange,
  onStatusChange,
  onRecipientChange,
  onGiverChange,
  onCostRangeChange,
  onClear,
  hasActiveFilters,
  activeFilterCount,
  totalCount,
  filteredCount,
  className,
}: GiftFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const statusOptions: FilterOption[] = statuses.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const peopleOptions: FilterOption[] = people.map((p) => ({
    id: p.id,
    label: p.name,
  }));

  const isFiltered = totalCount !== filteredCount;

  const filterContent = (
    <>
      <FilterDropdown
        label="Status"
        icon={<Tag className="h-3.5 w-3.5" />}
        options={statusOptions}
        selectedIds={filters.statusIds}
        onChange={(ids) => onStatusChange(ids as number[])}
      />

      <FilterDropdown
        label="Recipient"
        icon={<Users className="h-3.5 w-3.5" />}
        options={peopleOptions}
        selectedIds={filters.recipientIds}
        onChange={(ids) => onRecipientChange(ids as number[])}
      />

      <FilterDropdown
        label="Giver"
        icon={<UserCheck className="h-3.5 w-3.5" />}
        options={peopleOptions}
        selectedIds={filters.giverIds}
        onChange={(ids) => onGiverChange(ids as number[])}
      />

      <CostRangeFilter
        value={filters.costRange}
        onChange={onCostRangeChange}
      />
    </>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mobile: Search + Filter button */}
      <div className="flex md:hidden items-center gap-2">
        <SearchFilter
          value={filters.search}
          onChange={onSearchChange}
          className="flex-1"
        />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-slate-900 border-slate-800 max-h-[80vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-white">Filter Gifts</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              {filterContent}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    onClear();
                    setMobileOpen(false);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear all filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Inline filters */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <SearchFilter
          value={filters.search}
          onChange={onSearchChange}
          className="w-48"
        />

        <div className="h-4 w-px bg-border/50" />

        {filterContent}

        {hasActiveFilters && (
          <>
            <div className="h-4 w-px bg-border/50" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={onClear}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {activeFilterCount}
              </Badge>
            </Button>
          </>
        )}
      </div>

      {isFiltered && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Showing</span>
          <Badge variant="outline" className="font-mono">
            {filteredCount}
          </Badge>
          <span className="text-muted-foreground">of</span>
          <Badge variant="outline" className="font-mono">
            {totalCount}
          </Badge>
          <span className="text-muted-foreground">gifts</span>
        </div>
      )}
    </div>
  );
}


