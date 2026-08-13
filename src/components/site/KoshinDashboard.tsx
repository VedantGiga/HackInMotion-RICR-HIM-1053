"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
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
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  LayoutDashboard,
  User,
  Menu,
  X,
  Search,
  ChevronRight,
  Activity,
  RefreshCw,
  Wallet,
  Target,
  LogOut,
  Star,
  Coffee,
  ShoppingBag,
  Home,
  Tv,
  Car,
  Lightbulb,
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

const INITIAL_TRANSACTIONS: Transaction[] = [];

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

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; gradient: string }> = {
  "Food & Dining":      { icon: Coffee,      color: "text-orange-500",  bg: "bg-orange-50",  border: "border-orange-200",  gradient: "from-orange-400" },
  "Subscriptions":      { icon: Tv,          color: "text-purple",      bg: "bg-purple/10",  border: "border-purple/20",   gradient: "from-purple" },
  "Travel & Transport": { icon: Car,         color: "text-skyblue",     bg: "bg-skyblue/10", border: "border-skyblue/20",  gradient: "from-skyblue" },
  "Housing & Rent":     { icon: Home,        color: "text-cyan",        bg: "bg-cyan/10",    border: "border-cyan/20",     gradient: "from-cyan" },
  "Bills & Utilities":  { icon: Lightbulb,   color: "text-yellow-600",  bg: "bg-yellow-50",  border: "border-yellow-200",  gradient: "from-yellow-400" },
  "Shopping":           { icon: ShoppingBag, color: "text-pinkish",     bg: "bg-pinkish/10", border: "border-pinkish/20",  gradient: "from-pinkish" },
  "Entertainment":      { icon: Star,        color: "text-violet",      bg: "bg-violet/10",  border: "border-violet/20",   gradient: "from-violet" },
  "Salary & Income":    { icon: Wallet,      color: "text-green-600",   bg: "bg-green-50",   border: "border-green-200",   gradient: "from-green-500" },
};

const DEFAULT_CATEGORY = { icon: DollarSign, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200", gradient: "from-gray-400" };

function getCatConfig(cat: string) {
  return CATEGORY_CONFIG[cat] ?? DEFAULT_CATEGORY;
}

export function KoshinDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "spending-analysis" | "budget" | "goals" | "subscriptions" | "simulator" | "ai">("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newMerchant, setNewMerchant] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newType, setNewType] = useState<"expense" | "income">("expense");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [foodCut, setFoodCut] = useState(35);
  const [subCut, setSubCut] = useState(25);
  const [shoppingCut, setShoppingCut] = useState(20);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    { role: "assistant", text: "Hello! I am Koshin AI, your personal financial advisor. Ask me anything about your spending, subscriptions, or savings goals!", time: "12:00 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
  const healthBadgeColor = healthScore >= 80 ? "bg-cyan/10 text-cyan-700 border-cyan/20" : healthScore >= 65 ? "bg-purple/10 text-purple border-purple/20" : "bg-orange-100 text-orange-600 border-orange-200";
  const healthRingColor = healthScore >= 80 ? "text-cyan" : healthScore >= 65 ? "text-purple" : "text-orange-500";

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

  const originalFood = categoryBreakdown["Food & Dining"] || 0;
  const originalSubs = categoryBreakdown["Subscriptions"] || 0;
  const originalShopping = categoryBreakdown["Shopping"] || 0;

  const simFoodSavings = originalFood * (foodCut / 100);
  const simSubSavings = originalSubs * (subCut / 100);
  const simShopSavings = originalShopping * (shoppingCut / 100);

  const totalMonthlySimSavings = simFoodSavings + simSubSavings + simShopSavings;
  const totalAnnualSimSavings = totalMonthlySimSavings * 12;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;
    const userMsg = { role: "user" as const, text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);
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
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        role: "assistant",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "transactions", label: "Transactions", icon: CreditCard, badge: transactions.length.toString() },
    { id: "spending-analysis", label: "Spending Analysis", icon: PieChart, badge: null },
    { id: "budget", label: "Budget", icon: Wallet, badge: null },
    { id: "goals", label: "Goals", icon: Target, badge: null },
    { id: "subscriptions", label: "Subscriptions", icon: Bell, badge: recurringBills.length.toString() },
    { id: "simulator", label: "What-If Simulator", icon: SlidersHorizontal, badge: null },
    { id: "ai", label: "Koshin AI", icon: Bot, badge: "NEW" },
  ] as const;

  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  return (
    <div className={`flex flex-col lg:flex-row bg-background relative text-ink ${
      isDashboardPage
        ? "h-screen overflow-hidden rounded-none border-none w-full"
        : "h-[85vh] border border-hairline rounded-3xl overflow-hidden shadow-2xl"
    }`}>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3.5 bg-background border-b border-hairline z-20 relative">
        <div className="flex items-center gap-2.5">
          <img src="/logofinal-bgremoved.png" alt="Koshin" className="h-6 w-auto object-contain scale-[2.5] origin-left ml-2" />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-ink hover:bg-offwhite rounded-xl border border-hairline transition-all"
        >
          {sidebarOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 z-30 transition-transform duration-300 lg:relative lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col bg-background lg:bg-offwhite/50 border-r border-hairline
      `}>
        {/* Logo */}
        <div className="hidden lg:flex items-center gap-3 px-6 pt-7 pb-6">
          <img src="/logofinal-bgremoved.png" alt="Koshin" className="h-7 w-auto object-contain scale-[2.5] origin-left ml-3" />
        </div>

        {/* Nav section label */}
        <div className="px-6 mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Navigation</span>
        </div>

        {/* Nav items */}
        <nav className="px-3 space-y-1 flex-1">
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
                  w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group relative
                  ${isActive
                    ? "bg-white text-ink border border-hairline shadow-sm"
                    : "text-muted-foreground hover:text-ink hover:bg-black/5"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple rounded-r-full" />
                )}
                <Icon className={`size-4.5 shrink-0 transition-colors ${isActive ? "text-purple" : "text-muted-foreground group-hover:text-ink"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    item.badge === "NEW"
                      ? "bg-purple text-white shadow-sm"
                      : "bg-black/5 text-muted-foreground"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider + bottom section */}
        <div className="mt-auto px-3 pb-5 pt-4 border-t border-hairline bg-white lg:bg-transparent">
          {/* Quick stats pill */}
          <div className="mx-1 mb-4 p-4 rounded-xl bg-background border border-hairline shadow-sm">
            <div className="flex items-center justify-between text-[11px] mb-2.5">
              <span className="text-muted-foreground font-semibold">Monthly Health</span>
              <span className={`font-bold ${healthRingColor}`}>{healthScore}/100</span>
            </div>
            <div className="h-1.5 w-full bg-offwhite rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-purple transition-all duration-700"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="size-9 rounded-full bg-offwhite border border-hairline flex items-center justify-center shrink-0 shadow-sm">
              <User className="size-4 text-ink" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-ink truncate">Alex Morgan</div>
              <div className="text-[10px] text-purple font-semibold tracking-wide">Premium User</div>
            </div>
            {isDashboardPage && (
              <a href="/" title="Sign out" className="p-2 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-ink transition-all">
                <LogOut className="size-4" />
              </a>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 bg-offwhite/30 h-full overflow-hidden">
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-6 border-b border-hairline bg-background">
          <div className="flex items-center gap-4">
            <h2 className="display text-2xl font-bold text-ink tracking-tight">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple/10 border border-purple/20 text-[10px] font-bold text-purple uppercase tracking-widest">
              <span className="size-1.5 rounded-full bg-purple animate-pulse" />
              Live Workspace
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "transactions" && (
              <div className="flex items-center gap-2 bg-background border border-hairline shadow-sm rounded-full px-4 py-2 max-w-[240px] w-full">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-ink placeholder-muted-foreground w-full"
                />
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1.5 bg-background border border-hairline shadow-sm rounded-full px-4 py-2 text-[12px] text-muted-foreground font-medium">
              <Activity className="size-3.5 text-ink" />
              August 2026
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8" data-lenis-prevent="true">
          
          {/* Success banner */}
          <AnimatePresence>
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="mb-6 p-4 bg-purple/10 border border-purple/20 rounded-2xl flex items-center gap-3 shadow-sm"
              >
                <div className="size-8 rounded-full bg-purple border border-purple flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="size-4 text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-ink">Workspace Updated</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">Koshin Intelligence Engine processed and categorized your transactions.</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >

              {/* ──────────────────────────────────────────
                  TAB 1: OVERVIEW DASHBOARD
              ────────────────────────────────────────── */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                  {/* LEFT: stats + breakdown */}
                  <div className="xl:col-span-8 space-y-6">

                    {/* Stat cards row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      
                      {/* Income */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Income</span>
                            <div className="p-1.5 rounded-lg bg-cyan/10 text-cyan">
                              <ArrowDownLeft className="size-4" />
                            </div>
                          </div>
                          <div className="display text-3xl font-bold text-ink tracking-tight mt-1">
                            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-hairline">
                          <CheckCircle2 className="size-3.5 text-cyan" />
                          <span className="text-[11px] text-muted-foreground font-semibold">Auto-Verified Deposits</span>
                        </div>
                      </motion.div>

                      {/* Expenses */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Expenses</span>
                            <div className="p-1.5 rounded-lg bg-pinkish/10 text-pinkish">
                              <ArrowUpRight className="size-4" />
                            </div>
                          </div>
                          <div className="display text-3xl font-bold text-ink tracking-tight mt-1">
                            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-hairline">
                          <CreditCard className="size-3.5 text-pinkish" />
                          <span className="text-[11px] text-muted-foreground font-semibold">{transactions.filter(t => t.type === 'expense').length} Items Tracked</span>
                        </div>
                      </motion.div>

                      {/* Net Reserve */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Net Reserve</span>
                            <div className="p-1.5 rounded-lg bg-purple/10 text-purple">
                              <Wallet className="size-4" />
                            </div>
                          </div>
                          <div className={`display text-3xl font-bold tracking-tight mt-1 ${netSavings >= 0 ? 'text-purple' : 'text-pinkish'}`}>
                            {netSavings >= 0 ? '+' : ''}${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-hairline relative">
                          <Zap className="size-3.5 text-purple" />
                          <span className="text-[11px] text-muted-foreground font-semibold">{savingsRate}% Savings Rate</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Spending Breakdown */}
                    <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                          <h3 className="display text-lg font-bold text-ink tracking-tight">
                            Spending Breakdown
                          </h3>
                          <p className="text-[13px] text-muted-foreground mt-1">Koshin NLP Categorization Engine</p>
                        </div>
                        <button
                          onClick={handleImportMockCSV}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-offwhite hover:bg-black/5 border border-hairline rounded-full text-[13px] font-semibold text-ink transition-all"
                        >
                          <FileSpreadsheet className="size-4 text-purple" />
                          Import CSV Statement
                        </button>
                      </div>

                      <div className="space-y-5">
                        {Object.entries(categoryBreakdown)
                          .sort(([, a], [, b]) => b - a)
                          .map(([cat, amount]) => {
                            const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                            const cfg = getCatConfig(cat);
                            const Icon = cfg.icon;
                            return (
                              <div key={cat} className="group">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`size-8 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0`}>
                                    <Icon className={`size-4 ${cfg.color}`} strokeWidth={2.5} />
                                  </div>
                                  <div className="flex items-center justify-between flex-1">
                                    <span className="text-[14px] font-semibold text-ink">{cat}</span>
                                    <span className="text-ink font-bold text-[14px]">
                                      ${amount.toFixed(2)} <span className="text-muted-foreground font-medium ml-1">({pct}%)</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden ml-11">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} to-transparent`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Recent Transactions mini-list */}
                    <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="display text-lg font-bold text-ink tracking-tight">
                          Recent Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab("transactions")}
                          className="text-[13px] text-purple hover:text-purple/80 font-bold flex items-center gap-1 transition-colors"
                        >
                          View All <ChevronRight className="size-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {transactions.slice(0, 5).map(tx => {
                          const cfg = getCatConfig(tx.category);
                          const Icon = cfg.icon;
                          return (
                            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-offwhite border border-transparent hover:border-hairline transition-all -mx-3">
                              <div className={`size-10 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0 shadow-sm`}>
                                <Icon className={`size-4.5 ${cfg.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-bold text-ink truncate">{tx.merchant}</span>
                                  {tx.isRecurring && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-bold shrink-0">REC</span>
                                  )}
                                </div>
                                <div className="text-[12px] text-muted-foreground mt-0.5 font-medium">{tx.date} · {tx.category}</div>
                              </div>
                              <div className={`text-[15px] font-bold shrink-0 ${tx.type === 'income' ? 'text-cyan' : 'text-ink'}`}>
                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Health score + recommendations */}
                  <div className="xl:col-span-4 space-y-6">

                    {/* Health score card */}
                    <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col items-center text-center">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Financial Health Score</div>

                      <div className="relative size-48 mb-6">
                        {/* Background ring */}
                        <svg className="size-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-offwhite" fill="transparent" />
                          <circle
                            cx="50" cy="50" r="42"
                            stroke="url(#healthGrad)"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={263.89}
                            strokeDashoffset={263.89 - (263.89 * healthScore) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#00e5ff" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="display text-6xl font-extrabold text-ink tracking-tight">
                            {healthScore}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">/ 100</span>
                        </div>
                      </div>

                      <div className={`px-5 py-2 rounded-full text-[13px] font-bold border ${healthBadgeColor} mb-4 shadow-sm`}>
                        {healthRatingText}
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
                        Calculated from income/expense ratio, savings rate, and subscription commitments.
                      </p>

                      {/* Mini metric row */}
                      <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-hairline pt-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple">{savingsRate}%</div>
                          <div className="text-[11px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">Savings Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-cyan">{recurringBills.length}</div>
                          <div className="text-[11px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">Recurring Bills</div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm space-y-5">
                      <div className="flex items-center gap-2.5 border-b border-hairline pb-4">
                        <Zap className="size-5 text-purple" />
                        <span className="display text-[15px] font-bold text-ink">
                          Smart Recommendations
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="size-4 text-orange-500 shrink-0" />
                          <span className="text-[13px] font-bold text-orange-700">Optimize Subscriptions</span>
                        </div>
                        <p className="text-[13px] text-orange-800/80 leading-relaxed">
                          You spend ${(categoryBreakdown["Subscriptions"] || 0).toFixed(2)} on memberships monthly. Trimming unused trials could boost your health index.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/20 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="size-4 text-cyan shrink-0" />
                          <span className="text-[13px] font-bold text-cyan-800">Savings Opportunity</span>
                        </div>
                        <p className="text-[13px] text-cyan-800/80 leading-relaxed">
                          Reducing dining by 20% could free up ${(originalFood * 0.2).toFixed(2)}/month for your emergency reserve.
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab("simulator")}
                        className="w-full py-3 mt-2 rounded-full border border-purple bg-purple hover:bg-purple/90 text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <SlidersHorizontal className="size-4" />
                        Run What-If Simulation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────
                  TAB 2: TRANSACTIONS
              ────────────────────────────────────────── */}
              {activeTab === "transactions" && (
                <div className="space-y-6">
                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {["All", "Food & Dining", "Subscriptions", "Travel & Transport", "Housing & Rent", "Shopping", "Bills & Utilities"].map(cat => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 border ${
                            isActive
                              ? "bg-ink text-white border-ink shadow-md"
                              : "bg-background text-muted-foreground hover:text-ink border-hairline hover:bg-offwhite shadow-sm"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Transaction table */}
                  <div className="rounded-2xl border border-hairline bg-background shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-hairline bg-offwhite/50">
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Merchant</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Category</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((tx, idx) => {
                            const cfg = getCatConfig(tx.category);
                            const Icon = cfg.icon;
                            return (
                              <tr key={tx.id} className="border-b border-hairline hover:bg-offwhite transition-colors last:border-0">
                                <td className="py-4 px-6 text-[13px] font-medium text-muted-foreground whitespace-nowrap">{tx.date}</td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                                      <Icon className={`size-4 ${cfg.color}`} />
                                    </div>
                                    <div>
                                      <div className="font-bold text-ink text-[14px]">{tx.merchant}</div>
                                      {tx.isRecurring && (
                                        <span className="mt-1 inline-block text-[10px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">Recurring</span>
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
                                      <div className="h-full bg-cyan rounded-full" style={{ width: `${Math.round(tx.confidence * 100)}%` }} />
                                    </div>
                                    <span className="font-bold text-[12px] text-ink">{Math.round(tx.confidence * 100)}%</span>
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
                                  tx.type === 'income' ? 'text-cyan-700' : 'text-ink'
                                }`}>
                                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Add form */}
                  <div className="rounded-2xl border border-hairline bg-background shadow-sm p-7">
                    <div className="flex items-center gap-2.5 mb-2">
                      <PlusCircle className="size-5 text-purple" />
                      <h4 className="display text-lg font-bold text-ink">
                        Quick Add Transaction
                      </h4>
                    </div>
                    <p className="text-[13px] text-muted-foreground mb-6">AI will auto-categorize based on merchant description</p>
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Merchant (e.g. Starbucks)"
                        value={newMerchant}
                        onChange={e => setNewMerchant(e.target.value)}
                        className="sm:col-span-2 px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink placeholder-muted-foreground focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                      />
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink placeholder-muted-foreground focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newType}
                          onChange={e => setNewType(e.target.value as any)}
                          className="flex-1 px-3 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                        <button
                          type="submit"
                          className="px-5 py-3 bg-purple hover:bg-purple/90 text-white font-bold rounded-xl text-[14px] transition-all shadow-md shrink-0 whitespace-nowrap"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* ──────────────────────────────────────────
                  TAB: SPENDING ANALYSIS
              ────────────────────────────────────────── */}
              {activeTab === "spending-analysis" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="display text-2xl font-bold text-ink tracking-tight">Spending Analysis</h3>
                      <p className="text-[13px] text-muted-foreground mt-1">Deep dive into your financial habits and trends.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-offwhite border border-hairline rounded-lg text-[13px] font-semibold text-ink">
                        This Month
                      </div>
                      <button className="px-4 py-2 bg-purple text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-purple/90 transition-colors">
                        Download Report
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Insights & Summary */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pinkish/5 rounded-full blur-2xl pointer-events-none" />
                        <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Total Outflow</h4>
                        <div className="display text-4xl font-bold tracking-tight text-ink mb-2">
                          ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                          <ArrowDownRight className="size-3.5" />
                          <span>12.5% vs last month</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-hairline bg-gradient-to-br from-purple to-ink p-6 shadow-md text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="flex items-center gap-2 mb-3 text-cyan">
                          <Zap className="size-5" />
                          <span className="font-bold text-[13px] uppercase tracking-wide">AI Insight</span>
                        </div>
                        <p className="text-[14px] leading-relaxed text-white/90 relative z-10">
                          Your spending on <strong>Food & Dining</strong> is 20% lower than your historical average. Keep it up to boost your savings rate!
                        </p>
                      </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="lg:col-span-2 rounded-2xl border border-hairline bg-background p-7 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="display text-lg font-bold text-ink tracking-tight">Category Breakdown</h3>
                        <PieChart className="size-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-5">
                        {Object.entries(categoryBreakdown)
                          .sort(([, a], [, b]) => b - a)
                          .map(([cat, amount]) => {
                            const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                            const cfg = getCatConfig(cat);
                            const Icon = cfg.icon;
                            return (
                              <div key={cat} className="group">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0`}>
                                      <Icon className={`size-4 ${cfg.color}`} />
                                    </div>
                                    <span className="text-[14px] font-bold text-ink">{cat}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-[14px] text-ink">${amount.toFixed(2)}</div>
                                    <div className="text-[11px] font-semibold text-muted-foreground">{pct}% of total</div>
                                  </div>
                                </div>
                                <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} to-transparent`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                          
                        {Object.keys(categoryBreakdown).length === 0 && (
                          <div className="py-10 text-center text-[13px] font-semibold text-muted-foreground">
                            No expense data available for analysis.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────
                  TAB: BUDGET
              ────────────────────────────────────────── */}
              {activeTab === "budget" && (
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
              )}

              {/* ──────────────────────────────────────────
                  TAB: GOALS
              ────────────────────────────────────────── */}
              {activeTab === "goals" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="display text-2xl font-bold text-ink tracking-tight">Savings Goals</h3>
                      <p className="text-[13px] text-muted-foreground mt-1">Plan for the future and track your progress.</p>
                    </div>
                    <button className="px-4 py-2 bg-purple text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-purple/90 transition-colors flex items-center gap-2">
                      <PlusCircle className="size-4" /> New Goal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Goal 1: Emergency Fund */}
                    <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-5 text-cyan" />
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-ink">Emergency Fund</div>
                            <div className="text-[12px] font-semibold text-muted-foreground">3 months of expenses</div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                          On Track
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-2">
                          <div className="text-3xl font-bold text-ink tracking-tight">$6,500</div>
                          <div className="text-[13px] font-medium text-muted-foreground mb-1">Target: $10,000</div>
                        </div>
                        <div className="h-2.5 w-full bg-offwhite rounded-full overflow-hidden">
                          <div className="h-full bg-cyan rounded-full transition-all duration-1000" style={{ width: '65%' }} />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[12px] font-bold text-muted-foreground">
                          <span>65% Funded</span>
                          <span>Est. completion: Dec 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Goal 2: Japan Trip */}
                    <div className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-pinkish/10 border border-pinkish/20 flex items-center justify-center shrink-0">
                            <Car className="size-5 text-pinkish" />
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-ink">Japan Trip</div>
                            <div className="text-[12px] font-semibold text-muted-foreground">Vacation 2027</div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-md bg-offwhite text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                          In Progress
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-2">
                          <div className="text-3xl font-bold text-ink tracking-tight">$1,200</div>
                          <div className="text-[13px] font-medium text-muted-foreground mb-1">Target: $4,500</div>
                        </div>
                        <div className="h-2.5 w-full bg-offwhite rounded-full overflow-hidden">
                          <div className="h-full bg-pinkish rounded-full transition-all duration-1000" style={{ width: '26%' }} />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[12px] font-bold text-muted-foreground">
                          <span>26% Funded</span>
                          <span>Est. completion: Apr 2027</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────
                  TAB 3: SUBSCRIPTIONS
              ────────────────────────────────────────── */}
              {activeTab === "subscriptions" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                  <div className="xl:col-span-8 space-y-6">
                    {/* Header summary */}
                    <div className="rounded-2xl border border-hairline bg-background shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="size-16 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0">
                        <Bell className="size-7 text-purple" />
                      </div>
                      <div className="flex-1">
                        <div className="display text-3xl font-bold text-ink">
                          ${recurringBills.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0).toFixed(2)}
                          <span className="text-[15px] text-muted-foreground font-medium ml-2">/ month</span>
                        </div>
                        <div className="text-[13px] font-medium text-muted-foreground mt-1">{recurringBills.length} active commitments auto-detected</div>
                      </div>
                      <div className="sm:text-right p-4 bg-offwhite rounded-xl border border-hairline">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Annual Cost</div>
                        <div className="text-xl font-bold text-pinkish">${(recurringBills.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0) * 12).toFixed(0)}</div>
                      </div>
                    </div>

                    {/* Subscriptions list */}
                    <div className="rounded-2xl border border-hairline bg-background shadow-sm p-7">
                      <div className="mb-6 border-b border-hairline pb-4">
                        <h3 className="display text-lg font-bold text-ink">
                          Active Commitments
                        </h3>
                        <p className="text-[13px] text-muted-foreground mt-1">Silent recurring bills auto-detected from statement logs</p>
                      </div>
                      <div className="space-y-4">
                        {recurringBills.map(item => {
                          const cfg = getCatConfig(item.category);
                          const Icon = cfg.icon;
                          return (
                            <motion.div
                              key={item.id}
                              whileHover={{ x: 4 }}
                              className="p-4 rounded-xl bg-offwhite/50 border border-hairline hover:border-purple/30 transition-all duration-200 flex items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 bg-white`}>
                                  <Icon className={`size-5 ${cfg.color}`} />
                                </div>
                                <div>
                                  <div className="font-bold text-ink text-[15px]">{item.merchant}</div>
                                  <div className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <span className={`${cfg.color}`}>{item.category}</span>
                                    <span className="text-hairline">•</span>
                                    <span>Monthly billing</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-[16px] font-bold text-ink">${item.amount.toFixed(2)}<span className="text-muted-foreground text-[12px]">/mo</span></div>
                                <div className="text-[10px] text-purple font-bold uppercase tracking-widest mt-1 bg-purple/10 inline-block px-2 py-0.5 rounded-md">Monitored</div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="xl:col-span-4 space-y-6">
                    <div className="rounded-2xl border border-hairline bg-background shadow-sm p-7 space-y-5">
                      <div className="flex items-center gap-2.5 mb-2 border-b border-hairline pb-4">
                        <RefreshCw className="size-5 text-purple" />
                        <h4 className="display text-[15px] font-bold text-ink">
                          Renewal Calendar
                        </h4>
                      </div>
                      <p className="text-[13px] text-muted-foreground font-medium">Next predicted billing statements:</p>

                      <div className="p-5 rounded-xl bg-purple/5 border border-purple/20 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-[14px]">ConEd Electric</span>
                          <span className="text-cyan-700 font-bold text-[11px] bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-md">Aug 18</span>
                        </div>
                        <div className="text-2xl font-bold text-ink">${94.20.toFixed(2)}</div>
                        <div className="text-[12px] font-medium text-muted-foreground">Bills & Utilities</div>
                      </div>

                      <div className="p-5 rounded-xl bg-pinkish/5 border border-pinkish/20 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-[14px]">Netflix Premium</span>
                          <span className="text-pinkish font-bold text-[11px] bg-pinkish/10 border border-pinkish/20 px-2.5 py-1 rounded-md">Aug 24</span>
                        </div>
                        <div className="text-2xl font-bold text-ink">${19.99.toFixed(2)}</div>
                        <div className="text-[12px] font-medium text-muted-foreground">Subscriptions</div>
                      </div>

                      <div className="p-5 rounded-xl bg-skyblue/5 border border-skyblue/20 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-[14px]">Spotify Family</span>
                          <span className="text-skyblue-700 font-bold text-[11px] bg-skyblue/10 border border-skyblue/20 px-2.5 py-1 rounded-md">Aug 28</span>
                        </div>
                        <div className="text-2xl font-bold text-ink">${16.99.toFixed(2)}</div>
                        <div className="text-[12px] font-medium text-muted-foreground">Subscriptions</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────
                  TAB 4: WHAT-IF SIMULATOR
              ────────────────────────────────────────── */}
              {activeTab === "simulator" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                  {/* Sliders */}
                  <div className="xl:col-span-7 rounded-2xl border border-hairline bg-background shadow-sm p-7 space-y-8">
                    <div className="border-b border-hairline pb-5">
                      <h3 className="display text-xl font-bold text-ink">
                        Interactive What-If Tool
                      </h3>
                      <p className="text-[14px] font-medium text-muted-foreground mt-2">Adjust sliders to simulate reductions in non-essential expenses</p>
                    </div>

                    {/* Slider: Food */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-sm">
                            <Coffee className="size-4 text-orange-500" />
                          </div>
                          <span className="text-[14px] font-bold text-ink">Food & Dining</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[16px] font-bold text-orange-500">{foodCut}%</span>
                          <span className="text-[12px] font-medium text-muted-foreground ml-2">(-${simFoodSavings.toFixed(2)}/mo)</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-3 w-full bg-offwhite border border-hairline rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${foodCut}%` }} />
                        </div>
                        <input
                          type="range" min="0" max="100" value={foodCut}
                          onChange={e => setFoodCut(Number(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
                        />
                      </div>
                    </div>

                    {/* Slider: Subs */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center shadow-sm">
                            <Tv className="size-4 text-purple" />
                          </div>
                          <span className="text-[14px] font-bold text-ink">Subscriptions</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[16px] font-bold text-purple">{subCut}%</span>
                          <span className="text-[12px] font-medium text-muted-foreground ml-2">(-${simSubSavings.toFixed(2)}/mo)</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-3 w-full bg-offwhite border border-hairline rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-purple rounded-full transition-all" style={{ width: `${subCut}%` }} />
                        </div>
                        <input
                          type="range" min="0" max="100" value={subCut}
                          onChange={e => setSubCut(Number(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
                        />
                      </div>
                    </div>

                    {/* Slider: Shopping */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-pinkish/10 border border-pinkish/20 flex items-center justify-center shadow-sm">
                            <ShoppingBag className="size-4 text-pinkish" />
                          </div>
                          <span className="text-[14px] font-bold text-ink">Shopping</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[16px] font-bold text-pinkish">{shoppingCut}%</span>
                          <span className="text-[12px] font-medium text-muted-foreground ml-2">(-${simShopSavings.toFixed(2)}/mo)</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-3 w-full bg-offwhite border border-hairline rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-pinkish rounded-full transition-all" style={{ width: `${shoppingCut}%` }} />
                        </div>
                        <input
                          type="range" min="0" max="100" value={shoppingCut}
                          onChange={e => setShoppingCut(Number(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
                        />
                      </div>
                    </div>

                    {/* Breakdown mini-table */}
                    <div className="pt-6 border-t border-hairline space-y-3">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Projected Savings Summary</div>
                      {[
                        { label: "Food & Dining", saving: simFoodSavings, color: "text-orange-500" },
                        { label: "Subscriptions", saving: simSubSavings, color: "text-purple" },
                        { label: "Shopping", saving: simShopSavings, color: "text-pinkish" },
                      ].map(r => (
                        <div key={r.label} className="flex items-center justify-between text-[13px] font-bold border-b border-hairline pb-2 last:border-0 last:pb-0">
                          <span className="text-ink">{r.label}</span>
                          <span className={`${r.color}`}>-${r.saving.toFixed(2)}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact panel */}
                  <div className="xl:col-span-5 flex flex-col gap-6">
                    <div className="rounded-2xl border border-purple bg-purple/5 shadow-md p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-[11px] font-bold text-purple uppercase tracking-widest mb-6">
                          <Activity className="size-3.5" /> Projection Analysis
                        </div>
                        
                        <h4 className="display text-2xl font-bold text-ink mb-3">
                          Projected Annual Savings
                        </h4>

                        <div className="display text-[56px] font-extrabold text-purple tracking-tight leading-none mb-2">
                          +${totalAnnualSimSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[15px] font-bold text-muted-foreground">per year · ${totalMonthlySimSavings.toFixed(2)}/mo</div>

                        <p className="text-[14px] text-ink leading-relaxed mt-6 font-medium">
                          This combined reduction frees up <strong className="text-purple">${totalMonthlySimSavings.toFixed(2)}/mo</strong>, which can be re-routed directly to your savings goals.
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-purple/20">
                        <div className="text-[11px] font-bold text-purple uppercase tracking-widest mb-4">Suggested Allocations</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Emergency Reserve", icon: ShieldCheck, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200 hover:border-cyan-400" },
                            { label: "Growth Portfolio", icon: TrendingUp, color: "text-purple", bg: "bg-purple/10", border: "border-purple/20 hover:border-purple/40" },
                            { label: "Vacation Fund", icon: Target, color: "text-pinkish", bg: "bg-pinkish/10", border: "border-pinkish/20 hover:border-pinkish/40" },
                            { label: "Retirement IRA", icon: Activity, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200 hover:border-orange-400" },
                          ].map(a => {
                            const Icon = a.icon;
                            return (
                              <div key={a.label} className={`p-4 rounded-xl ${a.bg} border ${a.border} text-center transition-all cursor-pointer group shadow-sm`}>
                                <Icon className={`size-5 ${a.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                                <div className="text-[11px] font-bold text-ink">{a.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────
                  TAB 5: KOSHIN AI CHAT
              ────────────────────────────────────────── */}
              {activeTab === "ai" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                  {/* Chat panel */}
                  <div className="xl:col-span-8 rounded-2xl border border-hairline bg-background shadow-sm flex flex-col overflow-hidden" style={{ height: "600px" }}>
                    {/* Chat header */}
                    <div className="flex items-center gap-4 px-6 py-5 border-b border-hairline bg-offwhite/50">
                      <div className="size-11 rounded-xl bg-purple text-white flex items-center justify-center shadow-md">
                        <Bot className="size-6" />
                      </div>
                      <div>
                        <div className="display text-[16px] font-bold text-ink">Koshin AI</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[12px] text-muted-foreground font-bold">Online — Ready to assist</span>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {chatMessages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                          >
                            {!isUser && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="size-6 rounded-md bg-purple text-white flex items-center justify-center shadow-sm">
                                  <Bot className="size-3.5" />
                                </div>
                                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Koshin AI</span>
                              </div>
                            )}
                            <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm ${
                              isUser
                                ? "bg-ink text-white rounded-tr-sm"
                                : "bg-offwhite text-ink border border-hairline rounded-tl-sm"
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-semibold mt-2 px-1">{msg.time}</span>
                          </motion.div>
                        );
                      })}

                      {/* Typing indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-2"
                          >
                            <div className="size-6 rounded-md bg-purple text-white flex items-center justify-center shadow-sm">
                              <Bot className="size-3.5" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-offwhite border border-hairline flex items-center gap-1.5 shadow-sm">
                              {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.span
                                  key={i}
                                  className="size-2 rounded-full bg-purple"
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick chip suggestions */}
                    <div className="px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-none border-t border-hairline pt-4 bg-offwhite/50">
                      {["How much did I spend on food?", "List active subscriptions", "What is my health score?", "How can I save more?"].map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleSendMessage(chip)}
                          className="px-4 py-2 bg-background hover:bg-white border border-hairline text-ink rounded-full text-[12px] font-bold transition-all shadow-sm whitespace-nowrap"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="px-6 pb-6 pt-2 bg-offwhite/50">
                      <form
                        onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="text"
                          placeholder="Ask Koshin AI about your finances..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          className="flex-1 px-5 py-3.5 rounded-full bg-background border border-hairline text-[14px] text-ink placeholder-muted-foreground focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple shadow-sm transition-all"
                        />
                        <button
                          type="submit"
                          disabled={isTyping}
                          className="px-6 py-3.5 bg-purple hover:bg-purple/90 text-white font-bold rounded-full text-[14px] transition-all flex items-center gap-2 shadow-md disabled:opacity-50 shrink-0"
                        >
                          <Send className="size-4" />
                          Send
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* AI info sidebar */}
                  <div className="xl:col-span-4 space-y-6">
                    <div className="rounded-2xl border border-hairline bg-background shadow-sm p-7 space-y-5">
                      <div className="flex items-center gap-2.5 border-b border-hairline pb-4">
                        <Sparkles className="size-5 text-purple" />
                        <h4 className="display text-[15px] font-bold text-ink">
                          AI Core Technicals
                        </h4>
                      </div>
                      <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                        Koshin AI indexes your merchant descriptions, transaction dates, and categories in an in-memory database to execute immediate NLP queries.
                      </p>

                      <div className="rounded-xl bg-offwhite border border-hairline p-5 space-y-4">
                        {[
                          { label: "Accuracy Ratio", value: "98.6%", color: "text-purple" },
                          { label: "NLP Framework", value: "Hybrid Model", color: "text-ink" },
                          { label: "Response Time", value: "< 800ms", color: "text-ink" },
                          { label: "Data Source", value: "In-Memory DB", color: "text-ink" },
                        ].map(stat => (
                          <div key={stat.label} className="flex items-center justify-between border-b border-hairline pb-2 last:border-0 last:pb-0">
                            <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                            <span className={`text-[13px] font-bold ${stat.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested topics */}
                    <div className="rounded-2xl border border-hairline bg-background shadow-sm p-7 space-y-4">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Suggested Topics</h4>
                      {[
                        { q: "How much did I spend on food?", icon: Coffee, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
                        { q: "List active subscriptions", icon: Bell, color: "text-purple", bg: "bg-purple/10", border: "border-purple/20" },
                        { q: "What is my health score?", icon: ShieldCheck, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
                        { q: "How can I save more?", icon: Target, color: "text-pinkish", bg: "bg-pinkish/10", border: "border-pinkish/20" },
                      ].map(s => {
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.q}
                            onClick={() => handleSendMessage(s.q)}
                            className="w-full flex items-center gap-3.5 p-3.5 rounded-xl bg-background hover:bg-offwhite border border-hairline transition-all text-left group shadow-sm hover:shadow-md"
                          >
                            <div className={`size-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                              <Icon className={`size-4 ${s.color}`} />
                            </div>
                            <span className="text-[13px] font-bold text-ink flex-1">{s.q}</span>
                            <ChevronRight className="size-4 text-muted-foreground group-hover:text-ink transition-colors shrink-0" />
                          </button>
                        );
                      })}
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
