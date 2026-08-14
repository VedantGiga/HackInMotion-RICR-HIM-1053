"use client";

import { useState } from "react";
import { Trash2, Edit2, X, Loader2 } from "lucide-react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { getCurrencySymbol } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const { setTransactions } = useDashboardStore();
  const curr = getCurrencySymbol();

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("Food & Dining");
  const [editDate, setEditDate] = useState("");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(id);
    } else {
      try {
        await fetch(`/api/v1/transactions?id=${id}`, { method: "DELETE" });
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Error deleting transaction:", err);
      }
    }
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setEditDesc(tx.merchant || "");
    setEditAmount(tx.amount.toString());
    setEditCategory(tx.category || "Food & Dining");
    setEditDate(tx.date || new Date().toISOString().split("T")[0]);
    setEditIsRecurring(tx.isRecurring || false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !editDesc || !editAmount) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/transactions/${editingTx.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editDesc,
          amount: parseFloat(editAmount),
          categoryName: editCategory,
          date: editDate,
          isRecurring: editIsRecurring,
        }),
      });

      if (res.ok) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === editingTx.id
              ? {
                  ...t,
                  merchant: editDesc,
                  description: editDesc,
                  amount: Math.abs(parseFloat(editAmount)),
                  category: editCategory,
                  date: editDate,
                  isRecurring: editIsRecurring,
                }
              : t
          )
        );
        setEditingTx(null);
      } else {
        alert("Failed to update transaction");
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-hairline bg-background shadow-sm overflow-hidden font-sans">
      {transactions.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
            <span className="text-xl font-bold">💳</span>
          </div>
          <h4 className="display text-lg font-bold text-ink">No Transactions Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Your transaction log is empty. Upload a bank CSV, PDF statement, or add a manual line item.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hairline bg-offwhite/50">
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Merchant / Description</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Category</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">AI Confidence</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
                <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const cfg = getCatConfig(tx.category);
                const Icon = cfg.icon;
                return (
                  <tr key={tx.id} className="border-b border-hairline hover:bg-offwhite/80 transition-colors last:border-0">
                    <td className="py-4 px-6 text-[13px] font-medium text-muted-foreground whitespace-nowrap">{tx.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                          <Icon className={`size-4 ${cfg.color}`} />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-[14px]">{tx.merchant}</div>
                          {tx.isRecurring && (
                            <span className="mt-1 inline-block text-[10px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">Recurring Bill</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md ${cfg.bg} ${cfg.color} text-[12px] font-bold border ${cfg.border}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-12 bg-offwhite rounded-full overflow-hidden">
                          <div className="h-full bg-cyan rounded-full" style={{ width: `${Math.round((tx.confidence || 0.95) * 100)}%` }} />
                        </div>
                        <span className="font-bold text-[12px] text-ink">{Math.round((tx.confidence || 0.95) * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                        tx.type === 'income' ? 'bg-purple/10 text-purple border-purple/20' : 'bg-pinkish/10 text-pinkish border-pinkish/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-[15px] whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-ink'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{curr}{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-purple hover:bg-purple/10 transition-colors cursor-pointer"
                          title="Edit line item"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-pinkish hover:bg-pinkish/10 transition-colors cursor-pointer"
                          title="Delete line item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT TRANSACTION MODAL */}
      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-hairline shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                <Edit2 className="size-4 text-purple" /> Edit Transaction
              </h4>
              <button onClick={() => setEditingTx(null)} className="p-1 text-muted-foreground hover:text-ink">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink">Merchant / Description</label>
                <input
                  type="text"
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink">Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite text-ink font-semibold"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Travel & Rides">Travel & Rides</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Income">Income</option>
                  <option value="General Expense">General Expense</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editRecurring"
                  checked={editIsRecurring}
                  onChange={(e) => setEditIsRecurring(e.target.checked)}
                  className="rounded border-hairline text-purple focus:ring-purple"
                />
                <label htmlFor="editRecurring" className="text-xs font-semibold text-ink cursor-pointer">
                  Is Recurring Monthly Bill?
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple hover:bg-purple/90 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
