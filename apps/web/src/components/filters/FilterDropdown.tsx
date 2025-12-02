"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: number | string;
  label: string;
  color?: string;
}

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  selectedIds: (number | string)[];
  onChange: (ids: (number | string)[]) => void;
  showCount?: boolean;
  emptyLabel?: string;
  className?: string;
}

export function FilterDropdown({
  label,
  icon,
  options,
  selectedIds,
  onChange,
  showCount = true,
  emptyLabel = "Any",
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (id: number | string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectAll = () => {
    onChange(options.map((o) => o.id));
  };

  const hasSelection = selectedIds.length > 0;
  const allSelected = selectedIds.length === options.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 border-dashed",
            hasSelection && "border-solid border-violet-500/50 bg-violet-500/10",
            className
          )}
        >
          {icon}
          <span className="font-medium">{label}</span>
          {hasSelection ? (
            <>
              {showCount && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 text-xs bg-violet-500/20 text-violet-300"
                >
                  {selectedIds.length}
                </Badge>
              )}
              <X
                className="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground"
                onClick={clearAll}
              />
            </>
          ) : (
            <ChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <div className="p-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
            <div className="flex gap-1">
              {!allSelected && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={selectAll}
                >
                  All
                </Button>
              )}
              {hasSelection && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={() => onChange([])}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {options.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <div
                  key={option.id}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    "hover:bg-accent/50 transition-colors cursor-pointer",
                    isSelected && "bg-accent/30"
                  )}
                  onClick={() => toggleOption(option.id)}
                >
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  {option.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span className="flex-1 text-left truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}


