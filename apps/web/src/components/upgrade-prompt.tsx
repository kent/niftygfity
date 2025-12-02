"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Gift, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { FREE_GIFT_LIMIT } from "@niftygifty/types";
import { useState } from "react";

interface UpgradePromptProps {
  variant?: "banner" | "card" | "dialog";
  onDismiss?: () => void;
}

export function UpgradePrompt({ variant = "banner", onDismiss }: UpgradePromptProps) {
  const { giftsRemaining, isPremium, billingStatus } = useAuth();

  if (isPremium || !billingStatus) return null;

  const giftCount = billingStatus.gift_count;
  const isAtLimit = giftsRemaining === 0;
  const isNearLimit = !isAtLimit && giftsRemaining !== null && giftsRemaining <= 3;

  if (!isAtLimit && !isNearLimit) return null;

  if (variant === "banner") {
    return (
      <div
        className={`relative px-4 py-3 rounded-lg border ${
          isAtLimit
            ? "bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 border-violet-500/30"
            : "bg-amber-500/10 border-amber-500/20"
        }`}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`p-2 rounded-lg ${
              isAtLimit
                ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                : "bg-amber-500/20"
            }`}
          >
            {isAtLimit ? (
              <Crown className="w-4 h-4 text-white" />
            ) : (
              <Gift className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">
              {isAtLimit
                ? "You've reached your free gift limit"
                : `Only ${giftsRemaining} free gift${giftsRemaining === 1 ? "" : "s"} remaining`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAtLimit
                ? "Upgrade to Premium for unlimited gift tracking"
                : `${giftCount} of ${FREE_GIFT_LIMIT} free gifts used`}
            </p>
          </div>
          <Link href="/billing">
            <Button
              size="sm"
              className={
                isAtLimit
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
                  : ""
              }
            >
              <Sparkles className="w-4 h-4" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-pink-500/20 border border-violet-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Upgrade to Premium</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isAtLimit
                ? "You've used all your free gifts. Unlock unlimited gift tracking for just $0.068 CAD/day."
                : `Only ${giftsRemaining} free gift${giftsRemaining === 1 ? "" : "s"} left. Upgrade now for unlimited tracking.`}
            </p>
            <div className="flex items-center gap-3">
              <Link href="/billing">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
                  <Sparkles className="w-4 h-4" />
                  View Plans
                </Button>
              </Link>
              <Badge variant="secondary" className="text-muted-foreground">
                Starting at $25 CAD/year
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Hook to show upgrade prompt on gift limit error
export function useGiftLimitHandler() {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { refreshBillingStatus } = useAuth();

  const handleGiftLimitError = async () => {
    await refreshBillingStatus();
    setShowUpgradePrompt(true);
  };

  return {
    showUpgradePrompt,
    setShowUpgradePrompt,
    handleGiftLimitError,
  };
}

