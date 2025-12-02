"use client";

import { useState } from "react";
import type { GiftStatus } from "@niftygifty/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tags, Plus, Trash2, GripVertical } from "lucide-react";

interface GiftStatusSectionProps {
  statuses: GiftStatus[];
  onAdd: (name: string) => Promise<void>;
  onDelete: (status: GiftStatus) => Promise<void>;
  onReorder: (statusId: number, newPosition: number) => Promise<void>;
}

function AddStatusForm({ onAdd }: { onAdd: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    try {
      await onAdd(name.trim());
      setName("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="New status name (e.g. Shipped, Wrapped)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={!name.trim() || isAdding}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function StatusItem({
  status,
  onDelete,
}: {
  status: GiftStatus;
  onDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors">
      <GripVertical className="h-4 w-4 text-slate-600 cursor-grab" />
      <span className="flex-1 text-slate-200">{status.name}</span>
      <span className="text-xs text-slate-500 tabular-nums">#{status.position}</span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function StatusList({
  statuses,
  onDelete,
}: {
  statuses: GiftStatus[];
  onDelete: (status: GiftStatus) => Promise<void>;
}) {
  if (statuses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Tags className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>No gift statuses yet</p>
        <p className="text-sm">Add statuses to track your gift progress</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {statuses.map((status) => (
        <StatusItem
          key={status.id}
          status={status}
          onDelete={() => onDelete(status)}
        />
      ))}
    </div>
  );
}

export function GiftStatusSection({
  statuses,
  onAdd,
  onDelete,
}: GiftStatusSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Tags className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Gift Statuses</h2>
      </div>
      <p className="text-slate-400 text-sm mb-4">
        Create custom statuses to track your gift progress (e.g., Idea, Purchased, Wrapped, Given).
      </p>

      <AddStatusForm onAdd={onAdd} />
      <StatusList statuses={statuses} onDelete={onDelete} />
    </section>
  );
}

