"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Loader2, MoreVertical } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextCell } from "./TextCell";
import { CurrencyCell } from "./CurrencyCell";
import { StatusCell } from "./StatusCell";
import { PeopleCell } from "./PeopleCell";
import type { Gift, Person, GiftStatus } from "@niftygifty/types";
import { cn } from "@/lib/utils";

interface SortableGiftRowProps {
  gift: Gift & { _isNew?: boolean; _isSaving?: boolean };
  people: Person[];
  statuses: GiftStatus[];
  deletingId: number | null;
  onUpdateGift: (id: number, updates: { name?: string; gift_status_id?: number; cost?: number }) => void;
  onUpdateRecipients: (id: number, recipientIds: number[]) => void;
  onUpdateGivers: (id: number, giverIds: number[]) => void;
  onInsertGift: (referenceId: number, position: "above" | "below") => void;
  onDeleteGift: (id: number) => void;
  onPersonCreated: (person: Person) => void;
}

export function SortableGiftRow({
  gift,
  people,
  statuses,
  deletingId,
  onUpdateGift,
  onUpdateRecipients,
  onUpdateGivers,
  onInsertGift,
  onDeleteGift,
  onPersonCreated,
}: SortableGiftRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gift.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-colors",
        gift._isNew && "bg-violet-500/5",
        gift._isSaving && "opacity-50",
        isDragging && "bg-muted/50 opacity-80 shadow-lg z-50"
      )}
    >
      <TableCell className="p-1 w-[40px]">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "flex items-center justify-center h-8 w-8 cursor-grab active:cursor-grabbing",
            "text-muted-foreground/50 hover:text-muted-foreground transition-colors",
            "opacity-0 group-hover:opacity-100 focus:opacity-100",
            isDragging && "opacity-100 cursor-grabbing"
          )}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="p-1">
        <PeopleCell
          selectedIds={gift.recipients.map((r) => r.id)}
          people={people}
          onChange={(ids) => onUpdateRecipients(gift.id, ids)}
          onPersonCreated={onPersonCreated}
          placeholder="Select recipient..."
        />
      </TableCell>
      <TableCell className="p-1">
        <PeopleCell
          selectedIds={gift.givers.map((g) => g.id)}
          people={people}
          onChange={(ids) => onUpdateGivers(gift.id, ids)}
          onPersonCreated={onPersonCreated}
          placeholder="Select giver..."
        />
      </TableCell>
      <TableCell className="p-1">
        <TextCell
          value={gift.name}
          onChange={(name) => onUpdateGift(gift.id, { name })}
          placeholder="Gift name..."
          isLink={!!gift.link}
        />
      </TableCell>
      <TableCell className="p-1">
        <StatusCell
          value={gift.gift_status_id}
          statuses={statuses}
          onChange={(statusId) => onUpdateGift(gift.id, { gift_status_id: statusId })}
        />
      </TableCell>
      <TableCell className="p-1">
        <CurrencyCell
          value={gift.cost}
          onChange={(cost) => onUpdateGift(gift.id, { cost: cost ? Number(cost) : undefined })}
        />
      </TableCell>
      <TableCell className="p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onInsertGift(gift.id, "above")}>
              <Plus className="h-4 w-4 mr-2" />
              Insert above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInsertGift(gift.id, "below")}>
              <Plus className="h-4 w-4 mr-2" />
              Insert below
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteGift(gift.id)}
              disabled={deletingId === gift.id}
              className="text-destructive focus:text-destructive"
            >
              {deletingId === gift.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

