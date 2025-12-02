"use client";

import { CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function BillingSection() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-amber-400" />
        <h2 className="text-xl font-semibold text-white">Billing</h2>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Manage your subscription and payment methods.
      </p>

      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Premium features and subscription management will be available here.
              Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

