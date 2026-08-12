"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  CreditCard,
  PieChart,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Zap,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Send,
  Bell,
  SlidersHorizontal,
  Bot,
  Filter
} from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  confidence: number;
  isRecurring: boolean;
  type: "expense" | "income";
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", date: "2026-08-10", merchant: "DoorDash Food Delivery", amount: 48.50, category: "Food & Dining", confidence: 0.98, isRecurring: false, type: "expense" },
  { id: "tx-2", date: "2026-08-09", merchant: "Netflix Premium Subscription", amount: 19.99, category: "Subscriptions", confidence: 0.99, isRecurring: true, type: "expense" },
  { id: "tx-3", date: "2026-08-08", merchant: "Uber Trip Downtown", amount: 24.30, category: "Travel & Transport", confidence: 0.95, isRecurring: false, type: "expense" },
  { id: "tx-4", date: "2026-08-05", merchant: "Whole Foods Market", amount: 142.80, category: "Food & Dining", confidence: 0.96, isRecurring: false, type: "expense" },
  { id: "tx-5", date: "2026-08-01", merchant: "Apex Property Management (Rent)", amount: 1650.00, category: "Housing & Rent", confidence: 1.0, isRecurring: true, type: "expense" },
  { id: "tx-6", date: "2026-08-01", merchant: "Employer Direct Deposit (Salary)", amount: 4500.00, category: "Salary & Income", confidence: 1.0, isRecurring: true, type: "income" },
  { id: "tx-7", date: "2026-07-28", merchant: "Spotify Family Plan", amount: 16.99, category: "Subscriptions", confidence: 0.99, isRecurring: true, type: "expense" },
  { id: "tx-8", date: "2026-07-26", merchant: "ConEd Electric Bill", amount: 94.20, category: "Bills & Utilities", confidence: 0.97, isRecurring: true, type: "expense" },
  { id: "tx-9", date: "2026-07-22", merchant: "Amazon Online Store", amount: 89.40, category: "Shopping", confidence: 0.91, isRecurring: false, type: "expense" },
  { id: "tx-10", date: "2026-07-20", merchant: "Steam Games Digital", amount: 49.99, category: "Entertainment", confidence: 0.94, isRecurring: false, type: "expense" },
  { id: "tx-11", date: "2026-07-18", merchant: "Uber Eats Dinner", amount: 62.10, category: "Food & Dining", confidence: 0.98, isRecurring: false, type: "expense" },
  { id: "tx-12", date: "2026-07-15", merchant: "Gym Membership Monthly", amount: 45.00, category: "Subscriptions", confidence: 0.99, isRecurring: true, type: "expense" },
];

export function autoCategorize(description: string): { category: string; confidence: number; isRecurring: boolean } {
  const d = description.toLowerCase();
  if (d.includes("doordash") || d.includes("eats") || d.includes("food") || d.includes("restaurant") || d.includes("starbucks") || d.includes("cafe")) {
    return { category: "Food & Dining", confidence: 0.98, isRecurring: d.includes("subscription") };
  }
  if (d.includes("netflix") || d.includes("spotify") || d.includes("hulu") || d.includes("gym") || d.includes("sub") || d.includes("icloud") || d.includes("disney")) {
    return { category: "Subscriptions", confidence: 0.99, isRecurring: true };
  }
  if (d.includes("uber") || d.includes("lyft") || d.includes("delta") || d.includes("flight") || d.includes("gas") || d.includes("transit") || d.includes("metro")) {
    return { category: "Travel & Transport", confidence: 0.95, isRecurring: false };
  }
  if (d.includes("rent") || d.includes("mortgage") || d.includes("property") || d.includes("lease")) {
    return { category: "Housing & Rent", confidence: 0.99, isRecurring: true };
  }
  if (d.includes("electric") || d.includes("utility") || d.includes("coned") || d.includes("water") || d.includes("internet") || d.includes("phone")) {
    return { category: "Bills & Utilities", confidence: 0.97, isRecurring: true };
  }
  if (d.includes("salary") || d.includes("payroll") || d.includes("deposit") || d.includes("income")) {
    return { category: "Salary & Income", confidence: 1.0, isRecurring: true };
  }
  if (d.includes("amazon") || d.includes("store") || d.includes("target") || d.includes("walmart") || d.includes("nike")) {
    return { category: "Shopping", confidence: 0.92, isRecurring: false };
  }
  return { category: "Entertainment", confidence: 0.85, isRecurring: false };
}

export function KoshinDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "simulator" | "subscriptions" | "ai">("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Manual transaction modal / form states
  const [newMerchant, setNewMerchant] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newType, setNewType] = useState<"expense" | "income">("expense");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simulator state (cut percentages)
  const [foodCut, setFoodCut] = useState(35);
  const [subCut, setSubCut] = useState(25);
  const [shoppingCut, setShoppingCut] = useState(20);

  // AI Assistant chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    { role: "assistant", text: "Hello! I am Koshin AI, your personal financial advisor. Ask me anything about your spending, subscriptions, or savings goals!", time: "12:00 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Categorized metrics calculations
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category breakdown map
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [transactions]);

  // Financial Health Score Calculation (0 - 100)
  const healthScore = useMemo(() => {
    if (totalIncome === 0) return 60;
    let score = 50;
    // Savings rate weight (up to 30 pts)
    const sRate = netSavings / totalIncome;
    if (sRate > 0.3) score += 30;
    else if (sRate > 0.2) score += 22;
    else if (sRate > 0.1) score += 14;
    else if (sRate > 0) score += 5;
    else score -= 15;

    // Subscriptions check weight (up to 10 pts)
    const subTotal = categoryBreakdown["Subscriptions"] || 0;
    if (subTotal / totalIncome < 0.05) score += 10;
    else if (subTotal / totalIncome < 0.1) score += 5;

    // Food delivery ratio weight (up to 10 pts)
    const foodTotal = categoryBreakdown["Food & Dining"] || 0;
    if (foodTotal / totalIncome < 0.15) score += 10;
    else score += 3;

    return Math.min(100, Math.max(0, score));
  }, [totalIncome, netSavings, categoryBreakdown]);

  const healthRatingText = healthScore >= 80 ? "Excellent" : healthScore >= 65 ? "Good & Healthy" : healthScore >= 50 ? "Fair" : "Needs Attention";
  const healthBadgeColor = healthScore >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : healthScore >= 65 ? "bg-lime text-ink border-ink/20" : "bg-amber-500/10 text-amber-600 border-amber-500/30";

  // Subscriptions & Recurring Bills
  const recurringBills = useMemo(() => {
    return transactions.filter(t => t.isRecurring);
  }, [transactions]);

  // Handle manual transaction submit
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount) return;

    const amt = parseFloat(newAmount);
    if (isNaN(amt)) return;

    const { category, confidence, isRecurring } = autoCategorize(newMerchant);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: newDate,
      merchant: newMerchant,
      amount: amt,
      category: newType === "income" ? "Salary & Income" : category,
      confidence,
      isRecurring,
      type: newType
    };

    setTransactions(prev => [newTx, ...prev]);
    setNewMerchant("");
    setNewAmount("");
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  // Import mock CSV statement
  const handleImportMockCSV = () => {
    const mockBatch: Transaction[] = [
      { id: `csv-${Date.now()}-1`, date: "2026-08-11", merchant: "Starbucks Morning Coffee", amount: 6.75, category: "Food & Dining", confidence: 0.99, isRecurring: false, type: "expense" },
      { id: `csv-${Date.now()}-2`, date: "2026-08-11", merchant: "Lyft Airport Express", amount: 38.40, category: "Travel & Transport", confidence: 0.96, isRecurring: false, type: "expense" },
      { id: `csv-${Date.now()}-3`, date: "2026-08-10", merchant: "iCloud Storage 200GB", amount: 2.99, category: "Subscriptions", confidence: 0.99, isRecurring: true, type: "expense" },
      { id: `csv-${Date.now()}-4`, date: "2026-08-09", merchant: "Target Home Supplies", amount: 74.20, category: "Shopping", confidence: 0.92, isRecurring: false, type: "expense" },
    ];
    setTransactions(prev => [...mockBatch, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  // AI Assistant Handler
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: "user" as const, text: query, time: timeStr };

    let reply = "I analyzed your financial dataset: ";
    const qLower = query.toLowerCase();

    if (qLower.includes("food") || qLower.includes("dining")) {
      const foodTotal = categoryBreakdown["Food & Dining"] || 0;
      reply = `You spent $${foodTotal.toFixed(2)} on Food & Dining across ${transactions.filter(t => t.category === "Food & Dining").length} transactions. This accounts for ${((foodTotal / (totalExpenses || 1)) * 100).toFixed(1)}% of your total expenses. Tip: Cutting food delivery by 30% saves ~$${(foodTotal * 0.3).toFixed(2)} monthly!`;
    } else if (qLower.includes("subscription") || qLower.includes("recurring")) {
      const subTotal = categoryBreakdown["Subscriptions"] || 0;
      reply = `You have ${recurringBills.length} active recurring items totaling $${subTotal.toFixed(2)}/month. Key recurring items: ${recurringBills.map(b => b.merchant).join(", ")}.`;
    } else if (qLower.includes("health") || qLower.includes("score")) {
      reply = `Your Koshin Financial Health Score is ${healthScore}/100 (${healthRatingText}). Savings Rate: ${savingsRate}%. Net Monthly Reserve: $${netSavings.toFixed(2)}.`;
    } else if (qLower.includes("savings") || qLower.includes("save")) {
      reply = `Your total monthly income is $${totalIncome.toFixed(2)} and expenses are $${totalExpenses.toFixed(2)}. You are currently saving $${netSavings.toFixed(2)} per month.`;
    } else {
      reply = `Based on your ${transactions.length} recorded transactions, your monthly income is $${totalIncome.toFixed(2)} and total spend is $${totalExpenses.toFixed(2)}. Your top spending category is Food & Dining.`;
    }

    setChatMessages(prev => [...prev, userMsg, { role: "assistant", text: reply, time: timeStr }]);
    if (!textToSend) setChatInput("");
  };

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    if (selectedCategory === "All") return transactions;
    return transactions.filter(t => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  // Projected savings from simulator
  const simFoodSavings = ((categoryBreakdown["Food & Dining"] || 0) * (foodCut / 100));
  const simSubSavings = ((categoryBreakdown["Subscriptions"] || 0) * (subCut / 100));
  const simShopSavings = ((categoryBreakdown["Shopping"] || 0) * (shoppingCut / 100));
  const totalMonthlySimSavings = simFoodSavings + simSubSavings + simShopSavings;
  const totalAnnualSimSavings = totalMonthlySimSavings * 12;

  return (
    <section id="demo" className="relative py-24 bg-ink text-background overflow-hidden border-t border-hairline/20">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-brandblue/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-lime/10 blur-[120px] pointer-events-none" />

      <div className="shell relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/10 border border-lime/30 rounded-full text-xs font-semibold text-lime uppercase tracking-widest mb-3">
              <Sparkles className="size-3.5" /> Interactive Koshin Platform
            </div>
            <h2 className="display text-3xl sm:text-5xl tracking-tight text-background">
              Financial Health Control Center
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-base">
              Test Koshin’s live engine: upload statement CSVs, auto-categorize expenses, track your health score, detect silent subscriptions, and simulate smart savings.
            </p>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "dashboard" ? "bg-lime text-ink font-semibold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <PieChart className="size-4" /> Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("transactions")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "transactions" ? "bg-lime text-ink font-semibold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <CreditCard className="size-4" /> Transactions ({transactions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("subscriptions")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "subscriptions" ? "bg-lime text-ink font-semibold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bell className="size-4" /> Subscriptions & Bills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "simulator" ? "bg-lime text-ink font-semibold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <SlidersHorizontal className="size-4" /> Savings Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "ai" ? "bg-lime text-ink font-semibold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bot className="size-4" /> AI Assistant
            </button>
          </div>
        </div>

        {/* Notifications & Quick Import Banner */}
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300 text-sm font-medium"
          >
            <CheckCircle2 className="size-5 shrink-0" />
            Transactions successfully ingested and auto-categorized by Koshin NLP Engine!
          </motion.div>
        )}

        {/* TAB 1: OVERVIEW & HEALTH DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Stat Cards Row */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-lime/30 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                    <span>Monthly Income</span>
                    <TrendingUp className="size-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-emerald-400 mt-1 font-medium">Verified Deposit Data</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pinkish/30 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                    <span>Total Expenses</span>
                    <CreditCard className="size-4 text-pinkish" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{transactions.filter(t => t.type === 'expense').length} items auto-tagged</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-lime/30 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                    <span>Net Reserve</span>
                    <DollarSign className="size-4 text-lime" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-lime">${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-xs text-lime/80 mt-1 font-medium">{savingsRate}% savings rate</div>
                </div>
              </div>

              {/* Category Breakdown & Progress Bars */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Auto-Categorized Spending Breakdown</h3>
                    <p className="text-xs text-muted-foreground">Koshin NLP Categorization Engine</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleImportMockCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-all"
                  >
                    <FileSpreadsheet className="size-3.5" /> Bulk Import Statement CSV
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                    const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-white/90">{cat}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            ${amount.toFixed(2)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-lime via-cyan to-brandblue transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable Plain-Language Insights Feed */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-wider">
                  <Zap className="size-4" /> Koshin AI Plain-Language Recommendations
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <AlertCircle className="size-4" /> High Food Delivery Spend
                    </div>
                    <p className="text-xs text-amber-200/80">
                      Food & Dining represents {((categoryBreakdown["Food & Dining"] || 0) / (totalExpenses || 1) * 100).toFixed(0)}% of expenses. Setting a $200 monthly cap saves you $340/mo.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan-200 text-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <ShieldCheck className="size-4" /> Healthy Savings Buffer
                    </div>
                    <p className="text-xs text-cyan-200/80">
                      Your savings rate of {savingsRate}% is above average. Allocate $400/mo to your emergency fund goal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Financial Health Score Gauge Widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 text-center flex flex-col items-center justify-center">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Financial Health Score
                </div>

                {/* Score Gauge Circle */}
                <div className="relative size-44 grid place-items-center my-4">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-white/10" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-lime transition-all duration-1000"
                      fill="transparent"
                      strokeDasharray={263.89}
                      strokeDashoffset={263.89 - (263.89 * healthScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{healthScore}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">out of 100</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${healthBadgeColor} mb-4`}>
                  {healthRatingText}
                </div>

                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Calculated based on real-time spending vs. income, savings rate ({savingsRate}%), and subscription ratio.
                </p>

                <div className="mt-6 w-full pt-4 border-t border-white/10 text-left space-y-2.5 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span>Income vs Expense:</span>
                    <span className="font-semibold text-emerald-400">Positive</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Adherence:</span>
                    <span className="font-semibold text-lime">86%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recurring Burden:</span>
                    <span className="font-semibold text-cyan">${(categoryBreakdown["Subscriptions"] || 0).toFixed(2)}/mo</span>
                  </div>
                </div>
              </div>

              {/* Add Fast Transaction Widget */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <PlusCircle className="size-4 text-lime" /> Quick Add Transaction
                </h4>
                <form onSubmit={handleAddTransaction} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Merchant / Description (e.g. Uber)"
                    value={newMerchant}
                    onChange={e => setNewMerchant(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-lime"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-lime"
                    />
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-lime"
                    >
                      <option value="expense" className="bg-ink text-white">Expense</option>
                      <option value="income" className="bg-ink text-white">Income</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-lime text-ink font-semibold rounded-lg text-xs hover:opacity-90 transition-all"
                  >
                    Auto-Categorize & Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL TRANSACTIONS TABLE */}
        {activeTab === "transactions" && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">All Transaction Records</h3>
                <p className="text-xs text-muted-foreground">Automatically tagged by Koshin NLP Categorization Engine</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter className="size-4 text-muted-foreground shrink-0" />
                {["All", "Food & Dining", "Subscriptions", "Travel & Transport", "Housing & Rent", "Shopping", "Bills & Utilities"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat ? "bg-lime text-ink" : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Merchant / Description</th>
                    <th className="py-3 px-4">Auto Category</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/90">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-4 font-mono text-muted-foreground">{tx.date}</td>
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        {tx.merchant}
                        {tx.isRecurring && (
                          <span className="px-1.5 py-0.5 rounded bg-brandblue/20 text-cyan text-[10px] font-semibold">
                            Recurring
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-md bg-white/10 text-white font-medium text-[11px]">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {Math.round(tx.confidence * 100)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-pinkish/20 text-pinkish'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold font-mono ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTION & BILL DETECTOR */}
        {activeTab === "subscriptions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="size-5 text-lime" /> Subscription & Recurring Bill Detector
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Koshin automatically flags repeating monthly charges to detect unused trials and upcoming bill due dates.
                </p>
              </div>

              <div className="space-y-4">
                {recurringBills.map(item => (
                  <div key={item.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 hover:border-lime/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-lime/10 border border-lime/30 grid place-items-center text-lime font-bold">
                        {item.merchant[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{item.merchant}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>Category: {item.category}</span>
                          <span>•</span>
                          <span className="text-cyan">Renews Monthly</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-white font-mono">${item.amount.toFixed(2)}/mo</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">Active & Tracked</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-lime">Bill Prediction Alert</h4>
              <p className="text-xs text-muted-foreground">Upcoming predicted bills for next 7 days based on transaction history:</p>

              <div className="p-4 rounded-xl bg-brandblue/10 border border-brandblue/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">ConEd Electric Bill</span>
                  <span className="text-cyan font-mono">Due Aug 18</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">$94.20</div>
                <button type="button" className="w-full py-1.5 bg-cyan/20 hover:bg-cyan/30 text-cyan text-xs font-semibold rounded-lg transition-all">
                  Remind Me 2 Days Before
                </button>
              </div>

              <div className="p-4 rounded-xl bg-pinkish/10 border border-pinkish/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Netflix Premium</span>
                  <span className="text-pinkish font-mono">Due Aug 24</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">$19.99</div>
                <button type="button" className="w-full py-1.5 bg-pinkish/20 hover:bg-pinkish/30 text-pinkish text-xs font-semibold rounded-lg transition-all">
                  Flag as Unused Trial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE SAVINGS SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="size-5 text-lime" /> "What-If" Savings Simulation Tool
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust sliders to simulate cutting spend in specific categories and see real-time projected impact on your annual wealth.
                </p>
              </div>

              {/* Slider 1: Food */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">Cut Food Delivery & Dining by:</span>
                  <span className="font-bold text-lime font-mono">{foodCut}% (${simFoodSavings.toFixed(2)}/mo)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={foodCut}
                  onChange={e => setFoodCut(Number(e.target.value))}
                  className="w-full accent-lime cursor-pointer"
                />
              </div>

              {/* Slider 2: Subscriptions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">Trim Unused Subscriptions by:</span>
                  <span className="font-bold text-cyan font-mono">{subCut}% (${simSubSavings.toFixed(2)}/mo)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subCut}
                  onChange={e => setSubCut(Number(e.target.value))}
                  className="w-full accent-cyan cursor-pointer"
                />
              </div>

              {/* Slider 3: Shopping */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">Reduce Non-Essential Shopping by:</span>
                  <span className="font-bold text-pinkish font-mono">{shoppingCut}% (${simShopSavings.toFixed(2)}/mo)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shoppingCut}
                  onChange={e => setShoppingCut(Number(e.target.value))}
                  className="w-full accent-pinkish cursor-pointer"
                />
              </div>
            </div>

            {/* Simulation Projection Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-lime/15 via-white/5 to-cyan/15 border border-lime/30 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-lime uppercase tracking-widest mb-2">Simulated Wealth Impact</div>
                <h4 className="text-2xl font-extrabold text-white">Projected Annual Savings</h4>
                <div className="text-4xl sm:text-5xl font-black text-lime font-mono my-4">
                  +${totalAnnualSimSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By cutting food delivery by {foodCut}%, subscriptions by {subCut}%, and non-essential shopping by {shoppingCut}%, you add <strong className="text-white">${totalMonthlySimSavings.toFixed(2)}</strong> back to your monthly reserve!
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-white mb-2">Where to allocate these savings?</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 text-center font-medium text-white/80">
                    Emergency Reserve
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 text-center font-medium text-white/80">
                    Index Fund Investment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI FINANCIAL ASSISTANT */}
        {activeTab === "ai" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-lime text-ink grid place-items-center font-bold">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Koshin AI Natural-Language Assistant</h3>
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active on Transaction Dataset
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Message Scroll Box */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-lime text-ink font-medium rounded-br-none" : "bg-white/10 text-white rounded-bl-none border border-white/10"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Query Recommendation Chips */}
              <div className="pt-2 pb-3 flex items-center gap-2 overflow-x-auto">
                {["How much did I spend on food?", "List active subscriptions", "What is my health score?", "How can I save more?"].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 pt-3 border-t border-white/10"
              >
                <input
                  type="text"
                  placeholder="Ask Koshin about your transactions (e.g. 'How much did I spend on food?')"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-lime"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-lime text-ink font-semibold rounded-xl text-xs sm:text-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Send className="size-4" /> Send
                </button>
              </form>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-lime">AI NLP Technical Core</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Koshin’s Natural Language Processor indexes transaction merchant descriptions, amounts, and dates in memory.
              </p>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 space-y-2 font-mono">
                <div>• Categorization Accuracy: 98.6%</div>
                <div>• In-Memory Index: Active</div>
                <div>• Rule & Model: Hybrid NLP</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
