"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ExternalLink, Image, Trash2 } from "lucide-react";
import type { WishlistItem } from "@niftygifty/types";

interface WishlistItemCardProps {
  item: WishlistItem;
  onDelete?: (item: WishlistItem) => void;
  readOnly?: boolean;
}

export function WishlistItemCard({ item, onDelete, readOnly = false }: WishlistItemCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <Image className="h-6 w-6 text-slate-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm">
              {item.price && (
                <span className="flex items-center gap-1 text-slate-400">
                  <DollarSign className="h-3 w-3" />
                  {parseFloat(item.price).toFixed(2)}
                </span>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Link
                </a>
              )}
            </div>
          </div>
          {!readOnly && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300 shrink-0"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
