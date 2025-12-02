"use client";

import { useState } from "react";
import { ChevronDown, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CostRange } from "@niftygifty/types";
import { COST_RANGE_LABELS } from "@niftygifty/types";

interface CostRangeFilterProps {
  value: CostRange | null;
  onChange: (range: CostRange | null) => void;
  className?: string;
}

const RANGE_OPTIONS: CostRange[] = ["under25", "25to50", "50to100", "over100"];

export function CostRangeFilter({
  value,
  onChange,
  className,
}: CostRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectRange = (range: CostRange) => {
    onChange(range);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 border-dashed",
            value && "border-solid border-emerald-500/50 bg-emerald-500/10",
            className
          )}
        >
          <DollarSign className="h-3.5 w-3.5" />
          <span className="font-medium">Cost</span>
          {value ? (
            <>
              <Badge
                variant="secondary"
                className="ml-1 h-5 px-1.5 text-xs bg-emerald-500/20 text-emerald-300"
              >
                {COST_RANGE_LABELS[value]}
              </Badge>
              <X
                className="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground"
                onClick={clearValue}
              />
            </>
          ) : (
            <ChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="start">
        {RANGE_OPTIONS.map((range) => (
          <button
            key={range}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
              "hover:bg-accent/50 transition-colors cursor-pointer",
              value === range && "bg-accent/30 text-emerald-400"
            )}
            onClick={() => selectRange(range)}
          >
            <span className="flex-1 text-left">{COST_RANGE_LABELS[range]}</span>
            {value === range && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        ))}
        {value && (
          <>
            <div className="my-1 h-px bg-border/50" />
            <button
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              Clear filter
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}


