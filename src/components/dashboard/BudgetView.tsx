"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Loader2, Edit2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";
import { getCurrencySymbol } from "@/lib/utils";

interface BudgetViewProps {
  transactions: Transaction[];
}

interface DBBudget {
  id: string;
  limit: number;
  spent: number;
  progressPercentage: number;
  isOverBudget: boolean;
  category: {
    id: string;
    name: string;
  };
}

export function BudgetView({ transactions }: BudgetViewProps) {
  const { data: session } = useSession();
  const curr = (session?.user as any)?.currency || getCurrencySymbol();
  const [dbBudgets, setDbBudgets] = useState<DBBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [targetCat, setTargetCat] = useState("Food & Dining");
  const [limitInput, setLimitInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/budgets");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setDbBudgets(json.data);
        }
      }
    } catch (err) {
      console.error("Error fetching DB budgets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Aggregate local expenses by category
  const expenseCategories = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCat || !limitInput) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: targetCat,
          limit: parseFloat(limitInput),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setLimitInput("");
        await fetchBudgets();
      } else {
        alert("Failed to save budget");
      }
    } catch (err) {
      console.error("Error saving budget:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSetBudget = (catName: string, existingLimit?: number) => {
    setTargetCat(catName);
    setLimitInput(existingLimit ? existingLimit.toString() : "");
    setShowModal(true);
  };

  // Build combined map of category budgets
  const budgetMap = new Map<string, DBBudget>();
  dbBudgets.forEach((b) => {
    if (b.category?.name) budgetMap.set(b.category.name, b);
  });

  // Unique list of categories (either from local transactions or DB budgets)
  const allCategoryNames = Array.from(
    new Set([...expenseCategories.map(([c]) => c), ...dbBudgets.map((b) => b.category?.name).filter(Boolean)])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <h3 className="display text-xl font-bold text-ink">Category Monthly Budgets</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Persisted spending limits synced directly with your SQLite database
          </p>
        </div>
        <button
          onClick={() => handleOpenSetBudget("Food & Dining")}
          className="px-4 py-2.5 bg-purple hover:bg-purple/90 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <PlusCircle className="size-4 text-lime-300" /> Set Category Budget
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <Loader2 className="size-4 animate-spin text-purple" /> Loading saved budgets from database...
        </div>
      ) : allCategoryNames.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-background border border-hairline rounded-2xl">
          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
            <span className="text-xl font-bold">📊</span>
          </div>
          <h4 className="display text-lg font-bold text-ink">No Budgets or Category Spending Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Upload a bank statement or click &quot;Set Category Budget&quot; to define your monthly spending caps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategoryNames.map((catName) => {
            const cfg = getCatConfig(catName);
            const Icon = cfg.icon;

            const localSpent = transactions
              .filter((t) => t.type === "expense" && t.category === catName)
              .reduce((acc, t) => acc + t.amount, 0);

            const dbItem = budgetMap.get(catName);
            const amount = dbItem ? dbItem.spent : localSpent;
            // Fallback display estimate if no DB budget set
            const targetBudget = dbItem ? dbItem.limit : Math.max(Math.ceil(amount * 1.3 / 50) * 50, 200);
            const isCustomBudget = !!dbItem;

            const pct = Math.min((amount / targetBudget) * 100, 100);
            const isOver = amount > targetBudget;
            const isNearCap = !isOver && pct >= 85;

            return (
              <div key={catName} className="rounded-2xl border border-hairline bg-background p-6 shadow-sm relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`size-4 ${cfg.color}`} />
                    </div>
                    <span className="text-[14px] font-bold text-ink">{catName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        isOver
                          ? "bg-pinkish/10 text-pinkish border-pinkish/20 animate-pulse"
                          : isNearCap
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {isOver ? "Over Limit" : isNearCap ? "Near Cap" : "On Track"}
                    </span>
                    <button
                      onClick={() => handleOpenSetBudget(catName, targetBudget)}
                      className="p-1 text-muted-foreground hover:text-purple transition-colors cursor-pointer"
                      title="Edit Budget"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mb-2 flex items-end justify-between">
                  <div className="text-2xl font-bold text-ink tracking-tight">
                    {curr}{amount.toFixed(2)}
                  </div>
                  <div className="text-[13px] text-muted-foreground font-medium mb-1">
                    / {curr}{targetBudget.toFixed(2)}
                    {isCustomBudget && (
                      <span className="ml-1 text-[10px] font-bold text-purple bg-purple/10 px-1.5 py-0.5 rounded">DB</span>
                    )}
                  </div>
                </div>

                <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isOver ? "bg-pinkish" : isNearCap ? "bg-amber-500" : "bg-purple"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[12px] font-semibold">
                  <span
                    className={
                      isOver
                        ? "text-pinkish font-bold"
                        : isNearCap
                        ? "text-amber-700"
                        : "text-muted-foreground"
                    }
                  >
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

      {/* SET BUDGET MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-hairline shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <h4 className="font-bold text-ink text-sm">Set Category Budget</h4>
              <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:text-ink">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink">Category</label>
                <select
                  value={targetCat}
                  onChange={(e) => setTargetCat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Travel & Rides">Travel & Rides</option>
                  <option value="Utilities">Utilities</option>
                  <option value="General Expense">General Expense</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Monthly Limit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 500.00"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple hover:bg-purple/90 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save Budget to DB"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
