"use client";

import { PlusCircle, Coffee, Tv, ShoppingBag, PieChart } from "lucide-react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";
import { getCurrencySymbol } from "@/lib/utils";

interface BudgetViewProps {
  transactions: Transaction[];
}

export function BudgetView({ transactions }: BudgetViewProps) {
  const curr = getCurrencySymbol();
  // Aggregate expenses by category
  const categories = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="display text-xl font-bold text-ink">Category Monthly Budgets</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Automated spending limits calculated from historical cash flow</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-background border border-hairline rounded-2xl">
          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
            <span className="text-xl font-bold">📊</span>
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
            // Estimated budget threshold (1.5x current spend or min 200)
            const targetBudget = Math.max(Math.ceil(amount * 1.3 / 50) * 50, 200);
            const pct = Math.min((amount / targetBudget) * 100, 100);

            const isOver = amount > targetBudget;
            const isNearCap = !isOver && pct >= 85;

            return (
              <div key={cat} className="rounded-2xl border border-hairline bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`size-4 ${cfg.color}`} />
                    </div>
                    <span className="text-[14px] font-bold text-ink">{cat}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                    isOver 
                      ? 'bg-pinkish/10 text-pinkish border-pinkish/20 animate-pulse' 
                      : isNearCap 
                      ? 'bg-amber-100 text-amber-800 border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {isOver ? 'Over Limit' : isNearCap ? 'Near Cap' : 'On Track'}
                  </span>
                </div>
                <div className="mb-2 flex items-end justify-between">
                  <div className="text-2xl font-bold text-ink tracking-tight">
                    {curr}{amount.toFixed(2)}
                  </div>
                  <div className="text-[13px] text-muted-foreground font-medium mb-1">
                    / {curr}{targetBudget.toFixed(2)}
                  </div>
                </div>
                <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-pinkish' : isNearCap ? 'bg-amber-500' : 'bg-purple'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px] font-semibold">
                  <span className={isOver ? 'text-pinkish font-bold' : isNearCap ? 'text-amber-700' : 'text-muted-foreground'}>
                    {targetBudget - amount > 0 
                      ? `${curr}${(targetBudget - amount).toFixed(2)} remaining` 
                      : `Over by ${curr}${(amount - targetBudget).toFixed(2)}`}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-bold">{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
