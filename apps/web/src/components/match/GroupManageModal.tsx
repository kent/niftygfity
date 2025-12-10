"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Gift as GiftIcon } from "lucide-react";
import type { Gift } from "@niftygifty/types";
import type { MatchDisplayItem } from "./MatchWorkspace";

interface GroupManageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatchDisplayItem | null;
  gifts: Gift[];
  onRemoveGiftFromGroup: (groupId: string, giftId: number) => void;
}

export function GroupManageModal({
  open,
  onOpenChange,
  item,
  gifts,
  onRemoveGiftFromGroup,
}: GroupManageModalProps) {
  if (!item || item.kind !== "group" || !item.groupId) return null;

  const groupGifts = item.giftIds
    .map(id => gifts.find(g => g.id === id))
    .filter(Boolean) as Gift[];

  const handleRemove = (giftId: number) => {
    if (groupGifts.length <= 2) {
      // If only 2 gifts, removing one dissolves the group entirely
      onRemoveGiftFromGroup(item.groupId!, giftId);
      onOpenChange(false);
    } else {
      onRemoveGiftFromGroup(item.groupId!, giftId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <GiftIcon className="h-5 w-5 text-fuchsia-400" />
            Manage Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <p className="text-sm text-slate-400 mb-3">
            {groupGifts.length} gifts in this group • Total: ${item.cost.toFixed(0)}
          </p>

          {groupGifts.map(gift => (
            <div
              key={gift.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{gift.name}</p>
                {gift.cost && (
                  <p className="text-sm text-slate-400">${parseFloat(gift.cost).toFixed(0)}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(gift.id)}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {groupGifts.length === 2 && (
            <p className="text-xs text-slate-500 mt-3">
              Removing a gift will dissolve this group.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
