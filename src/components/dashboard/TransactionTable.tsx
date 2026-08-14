"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Edit2, X, Loader2, Search, Filter, ArrowUpRight, ArrowDownLeft, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { getCurrencySymbol } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const curr = getCurrencySymbol();
  const { setTransactions } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("Food & Dining");
  const [editDate, setEditDate] = useState("");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === "All") return true;
      if (selectedFilter === "Income") return tx.type === "income";
      if (selectedFilter === "Expense") return tx.type === "expense";
      if (selectedFilter === "Recurring") return tx.isRecurring;
      return tx.category === selectedFilter;
    });
  }, [transactions, searchQuery, selectedFilter]);

  // Totals
  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type !== "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

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

  const categoriesList = ["All", "Expense", "Income", "Recurring", "Food & Dining", "Shopping", "Subscriptions", "Travel & Rides", "Housing & Rent"];

  return (
    <div className="space-y-4 font-sans">
      {/* MINIMAL FILTER & SEARCH HEADER */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-hairline shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search merchant, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-offwhite border border-hairline text-xs font-semibold text-ink placeholder:text-muted-foreground outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Live Metrics Summary */}
        <div className="flex items-center gap-3 text-xs font-bold shrink-0 self-end md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
            <ArrowDownLeft className="size-3.5" />
            <span>+{curr}{totalIncome.toFixed(2)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-pinkish/10 text-pinkish border border-pinkish/20 flex items-center gap-1.5">
            <ArrowUpRight className="size-3.5" />
            <span>-{curr}{totalExpense.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CATEGORY PILL FILTER SCROLLER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedFilter === cat
                ? "bg-ink text-white border-ink shadow-xs scale-[1.02]"
                : "bg-white text-muted-foreground border-hairline hover:border-gray-300 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN TRANSACTION TABLE CARD */}
      <div className="rounded-2xl border border-hairline bg-white shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center space-y-3"
          >
            <div className="size-14 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
              <Tag className="size-6" />
            </div>
            <h4 className="display text-lg font-bold text-ink">No Matching Transactions</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || selectedFilter !== "All"
                ? "No transactions match your current search or category filter."
                : "Your transaction log is empty. Upload a bank statement CSV or PDF to view items."}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline bg-offwhite/40 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Merchant / Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">AI Confidence</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((tx, index) => {
                    const cfg = getCatConfig(tx.category);
                    const Icon = cfg.icon;
                    const isIncome = tx.type === "income";

                    return (
                      <motion.tr
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
                        className="hover:bg-offwhite/60 transition-colors group"
                      >
                        {/* Date */}
                        <td className="py-4 px-6 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          {tx.date}
                        </td>

                        {/* Merchant */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`size-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                              <Icon className={`size-4.5 ${cfg.color}`} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-ink text-xs truncate max-w-[220px]">
                                {tx.merchant}
                              </div>
                              {tx.isRecurring && (
                                <span className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-1.5 py-0.2 rounded-md">
                                  <Sparkles className="size-2.5" /> Recurring Bill
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category Tag */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} text-xs font-bold border ${cfg.border}`}>
                            {tx.category}
                          </span>
                        </td>

                        {/* AI Confidence */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-14 bg-offwhite rounded-full overflow-hidden border border-hairline">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  (tx.confidence || 0.95) >= 0.9
                                    ? "bg-emerald-500"
                                    : (tx.confidence || 0.95) >= 0.75
                                    ? "bg-purple"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${Math.round((tx.confidence || 0.95) * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-ink">
                              {Math.round((tx.confidence || 0.95) * 100)}%
                            </span>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              isIncome
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-pinkish/10 text-pinkish border-pinkish/20"
                            }`}
                          >
                            {isIncome ? "Income" : "Expense"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td
                          className={`py-4 px-6 text-right font-extrabold text-sm whitespace-nowrap ${
                            isIncome ? "text-emerald-600" : "text-ink"
                          }`}
                        >
                          {isIncome ? "+" : "-"}{curr}
                          {tx.amount.toFixed(2)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(tx)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-purple hover:bg-purple/10 transition-colors cursor-pointer"
                              title="Edit transaction"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-pinkish hover:bg-pinkish/10 transition-colors cursor-pointer"
                              title="Delete transaction"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT TRANSACTION MODAL */}
      <AnimatePresence>
        {editingTx && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-hairline shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                  <Edit2 className="size-4 text-purple" /> Edit Transaction
                </h4>
                <button
                  onClick={() => setEditingTx(null)}
                  className="p-1.5 rounded-xl hover:bg-offwhite text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                >
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
                    <label className="font-bold text-ink">Amount ({curr})</label>
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
                    className="rounded border-hairline text-purple focus:ring-purple cursor-pointer"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
