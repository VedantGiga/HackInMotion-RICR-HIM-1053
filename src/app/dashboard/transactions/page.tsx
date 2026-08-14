"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard,
  Search,
  Filter,
  Download,
  Trash2,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Home,
  Tv,
  Car,
  Lightbulb,
  DollarSign,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  description?: string;
  amount: number;
  category: string;
  confidence: number;
  isRecurring: boolean;
  type: "expense" | "income";
}

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  "Food & Dining": { icon: Coffee, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200" },
  "Shopping": { icon: ShoppingBag, color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200" },
  "Subscriptions": { icon: Tv, color: "text-pink-700", bg: "bg-pink-100", border: "border-pink-200" },
  "Housing & Rent": { icon: Home, color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200" },
  "Travel & Rides": { icon: Car, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200" },
  "Utilities": { icon: Lightbulb, color: "text-amber-800", bg: "bg-amber-100", border: "border-amber-300" },
  "Income": { icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200" },
};

const DEFAULT_CATEGORY = { icon: DollarSign, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" };

function getCatConfig(cat: string) {
  return CATEGORY_CONFIG[cat] ?? DEFAULT_CATEGORY;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/transactions");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped: Transaction[] = json.data.map((t: any) => ({
            id: t.id,
            date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            merchant: t.merchant || t.description,
            description: t.description,
            amount: t.amount,
            category: t.category?.name || "General Expense",
            confidence: t.confidence || 0.95,
            isRecurring: !!t.isRecurring,
            type: (t.category?.name === "Income" || t.category?.type === "income") ? "income" : "expense"
          }));
          setTransactions(mapped);
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/transactions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete all transactions from the database?")) return;
    try {
      const res = await fetch("/api/v1/transactions", { method: "DELETE" });
      if (res.ok) {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error clearing transactions:", err);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "income") return tx.type === "income";
    if (filter === "expenses") return tx.type === "expense";
    return true;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["Date", "Merchant", "Category", "Type", "Amount", "IsRecurring"];
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type,
      t.amount.toFixed(2),
      t.isRecurring ? "Yes" : "No"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `koshin_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-offwhite text-ink flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-20 border-b border-hairline bg-white/80 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm font-bold text-purple hover:text-purple/80 transition-colors flex items-center gap-2 cursor-pointer"
          >
            ← Back to Dashboard Overview
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-hairline rounded-full w-80 shadow-xs">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input 
            type="text" 
            placeholder="Search real transactions..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-ink placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Live Statement Transactions</h1>
            <p className="text-sm text-muted-foreground">Parsed directly from SQLite database and uploaded bank statements.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {filteredTransactions.length > 0 && (
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-hairline text-ink rounded-xl text-xs font-bold shadow-xs hover:bg-offwhite transition-colors cursor-pointer"
              >
                <Download className="size-4 text-purple" /> Export CSV
              </button>
            )}
            {transactions.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-pinkish/10 text-pinkish border border-pinkish/20 rounded-xl text-xs font-bold shadow-xs hover:bg-pinkish/20 transition-colors cursor-pointer"
              >
                <Trash2 className="size-4" /> Clear All Data
              </button>
            )}
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple/90 transition-colors cursor-pointer"
            >
              <PlusCircle className="size-4 text-lime-300" /> Upload Statement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-hairline pb-4">
          {["all", "income", "expenses"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f 
                  ? "bg-purple text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-white hover:text-ink border border-hairline"
              }`}
            >
              {f} ({
                f === "all" ? transactions.length :
                f === "income" ? transactions.filter(t => t.type === "income").length :
                transactions.filter(t => t.type === "expense").length
              })
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-hairline rounded-3xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
              <Loader2 className="size-5 animate-spin text-purple" /> Loading bank transactions from database...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CreditCard className="size-10 text-purple/40 mx-auto" />
              <h4 className="font-bold text-ink text-base">No Bank Transactions Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No matching line items found in SQLite. Click &quot;Upload Statement&quot; on the dashboard to import your real bank statement CSV or PDF.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-hairline text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-offwhite/50">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Merchant / Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">AI Confidence</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {filteredTransactions.map((tx) => {
                    const cfg = getCatConfig(tx.category);
                    const Icon = cfg.icon;
                    return (
                      <tr key={tx.id} className="hover:bg-offwhite/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-medium">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                              <Icon className={`size-4 ${cfg.color}`} />
                            </div>
                            <div>
                              <div className="font-bold text-ink text-xs">{tx.merchant}</div>
                              {tx.isRecurring && (
                                <span className="mt-0.5 inline-block text-[9px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded">Recurring</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-10 bg-offwhite rounded-full overflow-hidden">
                              <div className="h-full bg-cyan rounded-full" style={{ width: `${Math.round(tx.confidence * 100)}%` }} />
                            </div>
                            <span className="text-xs font-bold text-ink">{Math.round(tx.confidence * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            tx.type === 'income' ? 'bg-purple/10 text-purple border-purple/20' : 'bg-pinkish/10 text-pinkish border-pinkish/20'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-bold text-xs ${tx.type === 'income' ? "text-emerald-600" : "text-ink"}`}>
                          {tx.type === 'income' ? "+" : "-"}${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => handleDelete(tx.id)}
                            className="p-1.5 text-muted-foreground hover:text-pinkish transition-colors cursor-pointer rounded-lg hover:bg-pinkish/10"
                            title="Delete line item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
