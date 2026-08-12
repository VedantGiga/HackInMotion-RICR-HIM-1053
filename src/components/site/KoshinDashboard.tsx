"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
  User,
  Menu,
  X,
  Search,
  ChevronRight
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
  const desc = description.toLowerCase();
  if (desc.includes("doordash") || desc.includes("uber eats") || desc.includes("grubhub") || desc.includes("restaurant") || desc.includes("dinner") || desc.includes("food")) {
    return { category: "Food & Dining", confidence: 0.98, isRecurring: false };
  }
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("hulu") || desc.includes("youtube") || desc.includes("gym") || desc.includes("membership") || desc.includes("active")) {
    return { category: "Subscriptions", confidence: 0.99, isRecurring: true };
  }
  if (desc.includes("uber") || desc.includes("lyft") || desc.includes("taxi") || desc.includes("flight") || desc.includes("delta") || desc.includes("transit")) {
    return { category: "Travel & Transport", confidence: 0.95, isRecurring: false };
  }
  if (desc.includes("rent") || desc.includes("apartment") || desc.includes("property") || desc.includes("housing")) {
    return { category: "Housing & Rent", confidence: 1.0, isRecurring: true };
  }
  if (desc.includes("coned") || desc.includes("electric") || desc.includes("power") || desc.includes("water") || desc.includes("utility") || desc.includes("bill")) {
    return { category: "Bills & Utilities", confidence: 0.97, isRecurring: true };
  }
  if (desc.includes("amazon") || desc.includes("target") || desc.includes("walmart") || desc.includes("clothing") || desc.includes("shopping") || desc.includes("store")) {
    return { category: "Shopping", confidence: 0.91, isRecurring: false };
  }
  return { category: "Bills & Utilities", confidence: 0.72, isRecurring: false };
}

export function KoshinDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "subscriptions" | "simulator" | "ai">("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Manual transaction form states
  const [newMerchant, setNewMerchant] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newType, setNewType] = useState<"expense" | "income">("expense");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simulator state
  const [foodCut, setFoodCut] = useState(35);
  const [subCut, setSubCut] = useState(25);
  const [shoppingCut, setShoppingCut] = useState(20);

  // AI chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    { role: "assistant", text: "Hello! I am Koshin AI, your personal financial advisor. Ask me anything about your spending, subscriptions, or savings goals!", time: "12:00 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Metrics
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const categoryBreakdown = useMemo(() => {
    const breakDown: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      breakDown[t.category] = (breakDown[t.category] || 0) + t.amount;
    });
    return breakDown;
  }, [transactions]);

  const healthScore = useMemo(() => {
    let score = 75;
    if (savingsRate > 20) score += 10;
    else if (savingsRate > 10) score += 5;
    else if (savingsRate < 0) score -= 15;

    const subAmount = transactions.filter(t => t.category === "Subscriptions").reduce((acc, t) => acc + t.amount, 0);
    const subRatio = totalIncome > 0 ? subAmount / totalIncome : 0;
    if (subRatio > 0.08) score -= 8;
    else score += 3;

    return Math.min(100, Math.max(0, score));
  }, [totalIncome, netSavings, transactions]);

  const healthRatingText = healthScore >= 80 ? "Excellent" : healthScore >= 65 ? "Good & Healthy" : healthScore >= 50 ? "Fair" : "Needs Attention";
  const healthBadgeColor = healthScore >= 80 ? "bg-purple/10 text-purple border-purple/30" : healthScore >= 65 ? "bg-purple/20 text-purple border-purple/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30";

  const recurringBills = useMemo(() => {
    return transactions.filter(t => t.isRecurring);
  }, [transactions]);

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

  const handleImportMockCSV = () => {
    const mockTxs: Transaction[] = [
      { id: `csv-${Date.now()}-1`, date: "2026-08-11", merchant: "Amazon prime membership", amount: 14.99, category: "Subscriptions", confidence: 0.99, isRecurring: true, type: "expense" },
      { id: `csv-${Date.now()}-2`, date: "2026-08-11", merchant: "Chevron Gas Station", amount: 45.20, category: "Travel & Transport", confidence: 0.94, isRecurring: false, type: "expense" },
      { id: `csv-${Date.now()}-3`, date: "2026-08-10", merchant: "Starbucks Coffee Shop", amount: 6.80, category: "Food & Dining", confidence: 0.98, isRecurring: false, type: "expense" },
    ];
    setTransactions(prev => [...mockTxs, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchCat = selectedCategory === "All" || t.category === selectedCategory;
      const matchSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [transactions, selectedCategory, searchTerm]);

  // Simulator savings calculations
  const originalFood = categoryBreakdown["Food & Dining"] || 0;
  const originalSubs = categoryBreakdown["Subscriptions"] || 0;
  const originalShopping = categoryBreakdown["Shopping"] || 0;

  const simFoodSavings = originalFood * (foodCut / 100);
  const simSubSavings = originalSubs * (subCut / 100);
  const simShopSavings = originalShopping * (shoppingCut / 100);

  const totalMonthlySimSavings = simFoodSavings + simSubSavings + simShopSavings;
  const totalAnnualSimSavings = totalMonthlySimSavings * 12;

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    const userMsg = { role: "user" as const, text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "I analyzed your transactions. What specific details would you like to examine?";
      const q = messageText.toLowerCase();

      if (q.includes("food") || q.includes("dining") || q.includes("eat")) {
        const amt = categoryBreakdown["Food & Dining"] || 0;
        reply = `You have spent a total of $${amt.toFixed(2)} on Food & Dining. Your largest transaction here is Whole Foods at $142.80.`;
      } else if (q.includes("sub") || q.includes("recurring") || q.includes("netflix") || q.includes("spotify")) {
        reply = `You have ${recurringBills.length} active recurring subscriptions, totaling $${recurringBills.reduce((acc, t) => acc + t.amount, 0).toFixed(2)} per month. I recommend reviewing Netflix and Spotify.`;
      } else if (q.includes("score") || q.includes("health")) {
        reply = `Your Koshin Financial Health Score is currently ${healthScore}/100, which is rated as '${healthRatingText}'. Your high savings rate of ${savingsRate}% helps keep this strong.`;
      } else if (q.includes("save") || q.includes("reduce") || q.includes("cut")) {
        reply = `Based on your logs, cutting Food & Dining and Subscriptions by 20% would save you around $${(simFoodSavings + simSubSavings).toFixed(2)} monthly.`;
      }

      setChatMessages(prev => [...prev, {
        role: "assistant",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "subscriptions", label: "Subscriptions", icon: Bell },
    { id: "simulator", label: "What-If Simulator", icon: SlidersHorizontal },
    { id: "ai", label: "Koshin AI", icon: Bot }
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-navy border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-1/4 size-[400px] bg-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 size-[400px] bg-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-navy/80 backdrop-blur-md border-b border-white/10 z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-purple" />
          <span className="display font-bold text-white text-lg tracking-tight">Koshin Control Center</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white/80 hover:text-white rounded-lg bg-white/5"
        >
          {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-navy/95 border-r border-white/10 p-6 flex flex-col justify-between z-30 transition-transform duration-300 lg:relative lg:transform-none lg:bg-navy/30 lg:z-10
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="space-y-8">
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-purple to-cyan flex items-center justify-center shadow-lg">
              <Sparkles className="size-4 text-ink" />
            </div>
            <span className="display font-bold text-white text-lg tracking-tight">Koshin Control</span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-purple text-white shadow-lg shadow-purple/15 font-semibold" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className={`size-4.5 ${isActive ? "text-white" : "text-white/60"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-6 border-t border-white/5 flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/80">
            <User className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Alex Morgan</div>
            <div className="text-[10px] text-white/40 font-mono">Premium User</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto z-10 flex flex-col justify-between">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] font-bold text-purple uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-purple animate-pulse" />
              Live Workspace
            </div>
            <h2 className="display text-2xl lg:text-3xl text-white font-bold">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          {activeTab === "transactions" && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 max-w-xs w-full">
              <Search className="size-4 text-white/40" />
              <input
                type="text"
                placeholder="Search description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-white/35 w-full"
              />
            </div>
          )}
        </div>

        {/* NOTIFICATIONS BANNER */}
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-purple/15 border border-purple/35 rounded-2xl flex items-center gap-3 text-purple text-xs font-medium"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            Workspace successfully updated by Koshin Intelligence Engine.
          </motion.div>
        )}

        {/* TAB CONTENTS */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Bento Left: Stats & Category Breakdown */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Stat Card 1 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple/30 transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan/10 transition-all" />
                        <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span>Monthly Income</span>
                          <div className="p-1 rounded-lg bg-cyan/10 text-cyan">
                            <ArrowDownLeft className="size-3.5" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] text-cyan mt-1 font-medium flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Auto-Verified Deposits
                        </div>
                      </div>

                      {/* Stat Card 2 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pinkish/30 transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pinkish/5 rounded-full blur-2xl pointer-events-none group-hover:bg-pinkish/10 transition-all" />
                        <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span>Expenses</span>
                          <div className="p-1 rounded-lg bg-pinkish/10 text-pinkish">
                            <ArrowUpRight className="size-3.5" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] text-pinkish mt-1 font-medium flex items-center gap-1">
                          <CreditCard className="size-3" /> {transactions.filter(t => t.type === 'expense').length} Items Tracked
                        </div>
                      </div>

                      {/* Stat Card 3 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple/30 transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple/10 transition-all" />
                        <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span>Net Reserve</span>
                          <div className="p-1 rounded-lg bg-purple/10 text-purple">
                            <DollarSign className="size-3.5" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple font-mono">${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] text-purple/80 mt-1 font-medium flex items-center gap-1">
                          <Zap className="size-3" /> {savingsRate}% Savings Rate
                        </div>
                      </div>

                    </div>

                    {/* Breakdown */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Spending Breakdown</h3>
                          <p className="text-[10px] text-white/40">Koshin NLP Categorization Engine</p>
                        </div>
                        <button
                          onClick={handleImportMockCSV}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all"
                        >
                          <FileSpreadsheet className="size-3.5" /> Ingest mock Statement CSV
                        </button>
                      </div>

                      <div className="space-y-4">
                        {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                          const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                          return (
                            <div key={cat} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-white/80">{cat}</span>
                                <span className="text-[10px] text-white/50 font-mono">
                                  ${amount.toFixed(2)} ({pct}%)
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple via-cyan to-brandblue transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bento Right: Health Score & Recommendations */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Health Circle Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Financial Health</span>
                      
                      <div className="relative size-40 grid place-items-center mb-4">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-white/5" fill="transparent" />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-purple transition-all duration-1000"
                            fill="transparent"
                            strokeDasharray={263.89}
                            strokeDashoffset={263.89 - (263.89 * healthScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-extrabold text-white tracking-tight">{healthScore}</span>
                          <span className="text-[9px] text-white/30 uppercase font-semibold">Score Index</span>
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${healthBadgeColor} mb-2`}>
                        {healthRatingText}
                      </div>

                      <p className="text-[11px] text-white/50 max-w-xs leading-relaxed">
                        Calculated from income/expense ratio, savings rate, and subscription commitments.
                      </p>
                    </div>

                    {/* Recommendations Panel */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                      <div className="flex items-center gap-2 text-purple font-semibold text-xs uppercase tracking-wider mb-2">
                        <Zap className="size-4" /> Smart Recommendations
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed">
                        <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-300">
                          <AlertCircle className="size-3.5" /> Optimize Subscriptions
                        </div>
                        You spend ${(categoryBreakdown["Subscriptions"] || 0).toFixed(2)} on memberships. Trimming unused trials could boost health index.
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: TRANSACTIONS */}
              {activeTab === "transactions" && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  
                  {/* Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["All", "Food & Dining", "Subscriptions", "Travel & Transport", "Housing & Rent", "Shopping", "Bills & Utilities"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            selectedCategory === cat ? "bg-purple text-white font-semibold" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/5"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 uppercase text-[9px] tracking-wider">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Merchant / Description</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Confidence</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/80">
                        {filteredTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-white/5 transition-all">
                            <td className="py-3.5 px-4 font-mono text-white/40">{tx.date}</td>
                            <td className="py-3.5 px-4 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                {tx.merchant}
                                {tx.isRecurring && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-cyan/10 text-cyan text-[9px] font-bold">
                                    Recurring
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-1 rounded-md bg-white/5 text-white/80 text-[10px] border border-white/5">
                                {tx.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-cyan">
                              {Math.round(tx.confidence * 100)}%
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                                tx.type === 'income' ? 'bg-purple/10 text-purple' : 'bg-pinkish/10 text-pinkish'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className={`py-3.5 px-4 text-right font-semibold font-mono ${
                              tx.type === 'income' ? 'text-purple' : 'text-white'
                            }`}>
                              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Fast Add Widget */}
                  <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                    <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <PlusCircle className="size-4 text-purple" /> Quick Add transaction records
                    </h4>
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Merchant Description (e.g. Starbucks)"
                        value={newMerchant}
                        onChange={e => setNewMerchant(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple"
                      />
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple"
                      />
                      <select
                        value={newType}
                        onChange={e => setNewType(e.target.value as any)}
                        className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-purple"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                      <button
                        type="submit"
                        className="py-2.5 bg-purple hover:bg-purple/90 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
                      >
                        Auto-Categorize & Add
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* TAB 3: SUBSCRIPTIONS */}
              {activeTab === "subscriptions" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Commited subscriptions list */}
                  <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Active Commitments</h3>
                      <p className="text-[10px] text-white/40">Silent recurring bills auto-detected from statement logs</p>
                    </div>

                    <div className="space-y-3.5">
                      {recurringBills.map(item => (
                        <div key={item.id} className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-4 hover:border-purple/30 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-purple/10 border border-purple/35 grid place-items-center text-purple font-bold text-sm">
                              {item.merchant[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-xs">{item.merchant}</div>
                              <div className="text-[10px] text-white/40 flex items-center gap-1.5 mt-0.5">
                                <span>{item.category}</span>
                                <span>•</span>
                                <span className="text-cyan">Monthly billing</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-bold text-white font-mono">${item.amount.toFixed(2)}/mo</div>
                            <div className="text-[9px] text-purple font-semibold">Monitored</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar stats/alerts */}
                  <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple">Renewal Calendar</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Next predicted recurring billing statements:</p>

                    <div className="p-4 rounded-xl bg-purple/10 border border-purple/20 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">ConEd Electric</span>
                        <span className="text-cyan font-mono text-[10px]">Aug 18</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono">$94.20</div>
                    </div>

                    <div className="p-4 rounded-xl bg-pinkish/10 border border-pinkish/20 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Netflix Premium</span>
                        <span className="text-pinkish font-mono text-[10px]">Aug 24</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono">$19.99</div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: SIMULATOR */}
              {activeTab === "simulator" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Sliders panel */}
                  <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Interactive What-If Tool</h3>
                      <p className="text-[10px] text-white/40">Adjust sliders to simulate reductions in non-essential expenses</p>
                    </div>

                    {/* Food Slider */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">Reduce Food Delivery & Dining</span>
                        <span className="font-bold text-purple font-mono">{foodCut}% (-${simFoodSavings.toFixed(2)}/mo)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={foodCut}
                        onChange={e => setFoodCut(Number(e.target.value))}
                        className="w-full accent-purple cursor-pointer bg-white/10 h-1 rounded-full appearance-none"
                      />
                    </div>

                    {/* Subs Slider */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">Trim Subscriptions</span>
                        <span className="font-bold text-cyan font-mono">{subCut}% (-${simSubSavings.toFixed(2)}/mo)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={subCut}
                        onChange={e => setSubCut(Number(e.target.value))}
                        className="w-full accent-cyan cursor-pointer bg-white/10 h-1 rounded-full appearance-none"
                      />
                    </div>

                    {/* Shopping Slider */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">Scale down non-essential Shopping</span>
                        <span className="font-bold text-pinkish font-mono">{shoppingCut}% (-${simShopSavings.toFixed(2)}/mo)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shoppingCut}
                        onChange={e => setShoppingCut(Number(e.target.value))}
                        className="w-full accent-pinkish cursor-pointer bg-white/10 h-1 rounded-full appearance-none"
                      />
                    </div>
                  </div>

                  {/* Impact projection panel */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-purple/15 via-white/5 to-cyan/15 border border-purple/35 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple uppercase tracking-widest mb-1 block">Projection Analysis</span>
                      <h4 className="text-sm font-bold text-white/60 mb-4 uppercase">Projected Savings</h4>
                      <div className="text-4xl font-extrabold text-white font-mono my-2 tracking-tight">
                        +${totalAnnualSimSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        <span className="text-xs text-white/40 font-normal block mt-1">/ annually</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed mt-2">
                        Simulating a combined reduction saves <strong className="text-white">${totalMonthlySimSavings.toFixed(2)}/mo</strong>, which can be re-routed directly to your savings goals.
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider">Suggested Allocations</div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-white/70">
                        <div className="p-3 rounded-xl bg-black/40 text-center border border-white/5 hover:border-purple/35 transition-all">
                          Emergency Reserve
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 text-center border border-white/5 hover:border-cyan/35 transition-all">
                          Growth Portfolio
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: AI CHAT */}
              {activeTab === "ai" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Chat layout */}
                  <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-[480px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                      {chatMessages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                          <div
                            key={i}
                            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                          >
                            <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isUser ? "bg-purple text-white rounded-tr-none" : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-white/30 mt-1 px-1">{msg.time}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* chips */}
                    <div className="pt-2 pb-3 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {["How much did I spend on food?", "List active subscriptions", "What is my health score?", "How can I save more?"].map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleSendMessage(chip)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-full text-[10px] font-medium transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex items-center gap-2 pt-3 border-t border-white/5"
                    >
                      <input
                        type="text"
                        placeholder="Ask Koshin AI about your transaction logs..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-purple hover:bg-purple/90 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Send className="size-3.5" /> Send
                      </button>
                    </form>
                  </div>

                  {/* Sidebar description */}
                  <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple">AI Core Technicals</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Koshin AI indexes your merchant descriptions, transaction dates, and categories in an in-memory database to execute immediate NLP queries.
                    </p>
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-[10px] text-white/70 space-y-2 font-mono">
                      <div className="flex items-center justify-between">
                        <span>Accuracy Ratio:</span>
                        <span className="text-cyan font-bold">98.6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>NLP Framework:</span>
                        <span className="text-purple font-bold">In-Memory Rule/Model Hybrid</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
