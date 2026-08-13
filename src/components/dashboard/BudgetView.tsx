"use client";

import { PlusCircle, Coffee, Tv, ShoppingBag, PieChart } from "lucide-react";
import { getCatConfig } from "@/components/site/KoshinDashboard";

interface BudgetViewProps {
  categoryBreakdown: Record<string, number>;
}

export function BudgetView({ categoryBreakdown }: BudgetViewProps) {
  const categories = Object.entries(categoryBreakdown).filter(([_, amt]) => amt > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="display text-2xl font-bold text-ink tracking-tight">Budget Management</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Track your spending limits and stay on target.</p>
        </div>
        <button className="px-4 py-2 bg-purple hover:bg-purple/90 text-white rounded-lg text-[13px] font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer">
          <PlusCircle className="size-4" /> Create Budget
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-background p-12 text-center shadow-sm space-y-3">
          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
            <PieChart className="size-6" />
          </div>
          <h4 className="display text-lg font-bold text-ink">No Category Spending Detected</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Upload a bank statement or scan a receipt to automatically parse your transactions into category budgets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(([cat, amount]) => {
            const cfg = getCatConfig(cat);
            const Icon = cfg.icon;
            // Estimated budget threshold (1.5x current spend or min $200)
            const targetBudget = Math.max(Math.ceil(amount * 1.3 / 50) * 50, 200);
            const pct = Math.min((amount / targetBudget) * 100, 100);

            return (
              <div key={cat} className="rounded-2xl border border-hairline bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`size-4 ${cfg.color}`} />
                    </div>
                    <span className="text-[14px] font-bold text-ink">{cat}</span>
                  </div>
                  <span className="text-[12px] font-bold px-2 py-1 bg-offwhite rounded-md text-muted-foreground">Monthly</span>
                </div>
                <div className="mb-2 flex items-end justify-between">
                  <div className="text-2xl font-bold text-ink tracking-tight">
                    ${amount.toFixed(2)}
                  </div>
                  <div className="text-[13px] text-muted-foreground font-medium mb-1">
                    / ${targetBudget.toFixed(2)}
                  </div>
                </div>
                <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${pct > 90 ? 'bg-pinkish' : 'bg-purple'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-3 text-[12px] font-semibold text-muted-foreground">
                  {targetBudget - amount > 0 
                    ? `$${(targetBudget - amount).toFixed(2)} remaining` 
                    : "Over budget limit"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
