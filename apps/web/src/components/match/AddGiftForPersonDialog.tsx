"use client";

import { useState, useCallback, useTransition } from "react";
import { Gift as GiftIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { giftsService } from "@/services";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import type { Gift, Person, GiftStatus } from "@niftygifty/types";

interface AddGiftForPersonDialogProps {
  person: Person | null;
  holidayId: number;
  statuses: GiftStatus[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGiftCreated: (gift: Gift) => void;
}

export function AddGiftForPersonDialog({
  person,
  holidayId,
  statuses,
  open,
  onOpenChange,
  onGiftCreated,
}: AddGiftForPersonDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = useCallback(() => {
    setName("");
    setCost("");
    setLink("");
    setDescription("");
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetForm]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!person || !name.trim()) return;

      const statusId = statuses[0]?.id;
      if (!statusId) {
        toast.error("No gift status available");
        return;
      }

      startTransition(async () => {
        try {
          const created = await giftsService.create({
            name: name.trim(),
            holiday_id: holidayId,
            gift_status_id: statusId,
            cost: cost ? cost : undefined,
            link: link.trim() || undefined,
            description: description.trim() || undefined,
            recipient_ids: [person.id],
          });
          onGiftCreated(created);
          handleOpenChange(false);
          toast.success(`Gift added for ${person.name}`);
        } catch (err) {
          if (err instanceof ApiError && err.isGiftLimitReached) {
            toast.error("Gift limit reached", {
              description: "Upgrade to Premium for unlimited gift tracking.",
              action: {
                label: "Upgrade",
                onClick: () => (window.location.href = "/billing"),
              },
            });
          } else {
            toast.error("Failed to create gift");
          }
        }
      });
    },
    [person, name, cost, link, description, statuses, holidayId, onGiftCreated, handleOpenChange]
  );

  if (!person) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GiftIcon className="h-5 w-5 text-violet-400" />
            Add Gift for {person.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift-name">Name *</Label>
            <Input
              id="gift-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gift name"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gift-cost">Cost</Label>
            <Input
              id="gift-cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gift-link">Link</Label>
            <Input
              id="gift-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gift-description">Description</Label>
            <Textarea
              id="gift-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes about this gift..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Gift"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
