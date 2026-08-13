"use client";

import { PlusCircle, Coffee, Tv, ShoppingBag } from "lucide-react";

interface BudgetViewProps {
  categoryBreakdown: Record<string, number>;
}

export function BudgetView({ categoryBreakdown }: BudgetViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="display text-2xl font-bold text-ink tracking-tight">Budget Management</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Track your spending limits and stay on target.</p>
        </div>
        <button className="px-4 py-2 bg-ink text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-ink/90 transition-colors flex items-center gap-2">
          <PlusCircle className="size-4" /> Create Budget
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Budget: Food & Dining */}
        <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Coffee className="size-4 text-orange-500" />
              </div>
              <span className="text-[14px] font-bold text-ink">Food & Dining</span>
            </div>
            <span className="text-[12px] font-bold px-2 py-1 bg-offwhite rounded-md text-muted-foreground">Monthly</span>
          </div>
          <div className="mb-2 flex items-end justify-between">
            <div className="text-2xl font-bold text-ink tracking-tight">
              ${(categoryBreakdown["Food & Dining"] || 0).toFixed(2)}
            </div>
            <div className="text-[13px] text-muted-foreground font-medium mb-1">
              / $600.00
            </div>
          </div>
          <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${((categoryBreakdown["Food & Dining"] || 0) / 600) > 0.9 ? 'bg-pinkish' : 'bg-orange-400'}`}
              style={{ width: `${Math.min(((categoryBreakdown["Food & Dining"] || 0) / 600) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 text-[12px] font-semibold text-muted-foreground">
            {600 - (categoryBreakdown["Food & Dining"] || 0) > 0 
              ? `$${(600 - (categoryBreakdown["Food & Dining"] || 0)).toFixed(2)} remaining` 
              : "Over budget"}
          </div>
        </div>

        {/* Example Budget: Subscriptions */}
        <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0">
                <Tv className="size-4 text-purple" />
              </div>
              <span className="text-[14px] font-bold text-ink">Subscriptions</span>
            </div>
            <span className="text-[12px] font-bold px-2 py-1 bg-offwhite rounded-md text-muted-foreground">Monthly</span>
          </div>
          <div className="mb-2 flex items-end justify-between">
            <div className="text-2xl font-bold text-ink tracking-tight">
              ${(categoryBreakdown["Subscriptions"] || 0).toFixed(2)}
            </div>
            <div className="text-[13px] text-muted-foreground font-medium mb-1">
              / $150.00
            </div>
          </div>
          <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 bg-purple`}
              style={{ width: `${Math.min(((categoryBreakdown["Subscriptions"] || 0) / 150) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 text-[12px] font-semibold text-muted-foreground">
            {150 - (categoryBreakdown["Subscriptions"] || 0) > 0 
              ? `$${(150 - (categoryBreakdown["Subscriptions"] || 0)).toFixed(2)} remaining` 
              : "Over budget"}
          </div>
        </div>
        
        {/* Example Budget: Shopping */}
        <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-pinkish/10 border border-pinkish/20 flex items-center justify-center shrink-0">
                <ShoppingBag className="size-4 text-pinkish" />
              </div>
              <span className="text-[14px] font-bold text-ink">Shopping</span>
            </div>
            <span className="text-[12px] font-bold px-2 py-1 bg-offwhite rounded-md text-muted-foreground">Monthly</span>
          </div>
          <div className="mb-2 flex items-end justify-between">
            <div className="text-2xl font-bold text-ink tracking-tight">
              ${(categoryBreakdown["Shopping"] || 0).toFixed(2)}
            </div>
            <div className="text-[13px] text-muted-foreground font-medium mb-1">
              / $300.00
            </div>
          </div>
          <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 bg-pinkish`}
              style={{ width: `${Math.min(((categoryBreakdown["Shopping"] || 0) / 300) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 text-[12px] font-semibold text-muted-foreground">
            {300 - (categoryBreakdown["Shopping"] || 0) > 0 
              ? `$${(300 - (categoryBreakdown["Shopping"] || 0)).toFixed(2)} remaining` 
              : "Over budget"}
          </div>
        </div>
      </div>
    </div>
  );
}
