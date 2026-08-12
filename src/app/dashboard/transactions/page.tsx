"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  CreditCard,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Coffee,
  Plane,
  Monitor
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger rows
      gsap.fromTo(".tx-row",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [filter]); // Re-run animation when filter changes

  const allTransactions = [
    { id: 1, merchant: "Apple Store", category: "Electronics", amount: -1299.00, date: "Aug 12, 2026", status: "Completed", icon: Monitor },
    { id: 2, merchant: "Starbucks", category: "Food & Dining", amount: -6.50, date: "Aug 12, 2026", status: "Completed", icon: Coffee },
    { id: 3, merchant: "TechCorp Salary", category: "Income", amount: 4200.00, date: "Aug 10, 2026", status: "Completed", icon: ArrowUpRight, positive: true },
    { id: 4, merchant: "Delta Airlines", category: "Travel", amount: -450.00, date: "Aug 9, 2026", status: "Completed", icon: Plane },
    { id: 5, merchant: "Whole Foods", category: "Groceries", amount: -142.50, date: "Aug 8, 2026", status: "Pending", icon: ShoppingBag },
    { id: 6, merchant: "Netflix", category: "Entertainment", amount: -15.99, date: "Aug 7, 2026", status: "Completed", icon: CreditCard },
    { id: 7, merchant: "Uber Ride", category: "Transport", amount: -24.90, date: "Aug 7, 2026", status: "Completed", icon: ArrowDownRight },
  ];

  const filteredTransactions = allTransactions.filter(tx => {
    if (filter === "income") return tx.positive;
    if (filter === "expenses") return !tx.positive;
    return true;
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-offwhite text-ink flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-20 border-b border-hairline bg-white/50 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm font-bold text-ink/60 hover:text-ink transition-colors flex items-center gap-2"
          >
            ← Back to Overview
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-offwhite border border-hairline rounded-full w-96 focus-within:border-purple/50 focus-within:ring-1 focus-within:ring-purple/20 transition-all">
          <Search className="size-4 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-ink/30"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Transactions</h1>
            <p className="text-sm text-ink/60">Manage and categorize your recent financial activity.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-hairline rounded-lg text-sm font-bold shadow-sm hover:border-ink/20 transition-colors">
              <Download className="size-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-lg text-sm font-bold shadow-md hover:bg-ink/90 transition-colors">
              <Filter className="size-4" /> Filter
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-hairline pb-4">
          {["all", "income", "expenses"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-all ${
                filter === f 
                  ? "bg-purple/10 text-purple border border-purple/20" 
                  : "text-ink/60 hover:bg-offwhite hover:text-ink border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-hairline rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-wider text-ink/40 bg-offwhite/50">
                  <th className="px-6 py-4 font-semibold">Merchant</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="tx-row hover:bg-offwhite/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${
                          tx.positive ? "bg-emerald-500/10 text-emerald-600" : "bg-ink/5 text-ink/60 group-hover:bg-purple/10 group-hover:text-purple"
                        }`}>
                          <tx.icon className="size-4" />
                        </div>
                        <span className="font-bold text-ink">{tx.merchant}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple/10 text-purple border border-purple/20">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink/70">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-bold ${tx.status === 'Completed' ? 'text-ink/60' : 'text-amber-500'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-bold ${tx.positive ? "text-emerald-600" : "text-ink"}`}>
                      {tx.positive ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-ink/30 hover:text-ink transition-colors p-1">
                        <MoreHorizontal className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-ink/50 text-sm font-semibold">
              No transactions found.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
