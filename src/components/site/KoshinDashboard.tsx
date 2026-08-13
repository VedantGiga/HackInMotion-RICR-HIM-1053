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
  Settings,
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
  UploadCloud,
  Download,
  Lock,
  ArrowRight
} from "lucide-react";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { BudgetView } from "@/components/dashboard/BudgetView";
import { GoalsView } from "@/components/dashboard/GoalsView";
import { SubscriptionsView } from "@/components/dashboard/SubscriptionsView";
import { SimulatorView } from "@/components/dashboard/SimulatorView";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDashboardStore } from "@/store/useDashboardStore";

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

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; gradient: string }> = {
  "Food & Dining": { icon: Coffee, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", gradient: "from-amber-500" },
  "Shopping": { icon: ShoppingBag, color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200", gradient: "from-purple-500" },
  "Subscriptions": { icon: Tv, color: "text-pink-700", bg: "bg-pink-100", border: "border-pink-200", gradient: "from-pink-500" },
  "Housing & Rent": { icon: Home, color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200", gradient: "from-blue-500" },
  "Travel & Rides": { icon: Car, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", gradient: "from-emerald-500" },
  "Utilities": { icon: Lightbulb, color: "text-amber-800", bg: "bg-amber-100", border: "border-amber-300", gradient: "from-amber-600" },
  "Income": { icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", gradient: "from-emerald-500" },
};

const DEFAULT_CATEGORY = { icon: DollarSign, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200", gradient: "from-gray-400" };

export function getCatConfig(cat: string) {
  return CATEGORY_CONFIG[cat] ?? DEFAULT_CATEGORY;
}

export function KoshinDashboard() {
  const pathname = usePathname();
  const {
    activeTab, setActiveTab,
    sidebarOpen, setSidebarOpen,
    transactions, setTransactions,
    selectedCategory, setSelectedCategory,
    searchTerm, setSearchTerm,
    uploadSuccess, setUploadSuccess,
    newMerchant, setNewMerchant,
    newAmount, setNewAmount,
    newDate, setNewDate,
    newType, setNewType,
    foodCut, setFoodCut,
    subCut, setSubCut,
    shoppingCut, setShoppingCut
  } = useDashboardStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [apiHealthScore, setApiHealthScore] = useState<number | null>(null);
  const [apiInsights, setApiInsights] = useState<string[]>([]);
  const [apiSpending, setApiSpending] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    { role: "assistant", text: "Hello! I am Koshin AI, your personal financial advisor. Ask me anything about your spending, subscriptions, or savings goals!", time: "12:00 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Live API Integration with /api/v1/transactions, health, and spending
  useEffect(() => {
    async function loadApiData() {
      try {
        const [txRes, healthRes, spendingRes] = await Promise.all([
          fetch("/api/v1/transactions").catch(() => null),
          fetch("/api/v1/analysis/health").catch(() => null),
          fetch("/api/v1/analysis/spending").catch(() => null),
        ]);

        if (txRes && txRes.ok) {
          const json = await txRes.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            const mapped = json.data.map((t: any) => ({
              id: t.id,
              date: t.date ? new Date(t.date).toISOString().split('T')[0] : "2026-08-12",
              merchant: t.merchant || t.description,
              amount: t.amount,
              category: t.category?.name || "General Expense",
              confidence: t.confidence || 0.95,
              isRecurring: !!t.isRecurring,
              type: t.amount > 0 ? "expense" : "income"
            }));
            setTransactions(mapped);
          }
        }

        if (healthRes && healthRes.ok) {
          const json = await healthRes.json();
          if (json.data && typeof json.data.score === 'number') {
            setApiHealthScore(json.data.score);
            setApiInsights(json.data.insights || []);
          }
        }

        if (spendingRes && spendingRes.ok) {
          const json = await spendingRes.json();
          if (json.data) {
            setApiSpending(json.data);
          }
        }
      } catch (err) {
        console.log("Error loading API data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadApiData();
  }, [setTransactions]);

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

  const calculatedHealthScore = useMemo(() => {
    let score = 100;
    
    // Fallback if no data
    if (transactions.length === 0) return 0;

    const savings = totalIncome - totalExpenses;
    if (totalIncome > 0) {
      const rate = savings / totalIncome;
      if (rate < 0.1) score -= 20;
    } else {
      score -= 30; // No income
    }
    
    // Find top expense category
    let topCat = "";
    let maxAmt = 0;
    Object.entries(categoryBreakdown).forEach(([cat, amt]) => {
      if (amt > maxAmt) { maxAmt = amt; topCat = cat; }
    });
    
    if (topCat && maxAmt > (totalIncome * 0.4) && totalIncome > 0) {
      score -= 15;
    }
    
    return Math.min(100, Math.max(0, score));
  }, [totalIncome, totalExpenses, categoryBreakdown, transactions]);

  const healthScore = apiHealthScore !== null ? apiHealthScore : calculatedHealthScore;

  const healthRatingText = healthScore >= 80 ? "Excellent" : healthScore >= 65 ? "Good & Healthy" : healthScore >= 50 ? "Fair" : "Needs Attention";
  const healthRingColor = healthScore >= 80 ? "text-lime" : healthScore >= 65 ? "text-purple" : "text-orange-500";

  const recurringBills = useMemo(() => {
    return transactions.filter(t => t.isRecurring);
  }, [transactions]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParsingStep(1);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setParsingStep(2);
      const res = await fetch("/api/v1/transactions/import", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setParsingStep(3);
        // Refresh transactions to show newly imported ones
        const txRes = await fetch("/api/v1/transactions");
        if (txRes.ok) {
          const json = await txRes.json();
          if (json.data && Array.isArray(json.data)) {
            const mapped = json.data.map((t: any) => ({
              id: t.id,
              date: t.date ? new Date(t.date).toISOString().split('T')[0] : "2026-08-12",
              merchant: t.merchant || t.description,
              amount: t.amount,
              category: t.category?.name || "General Expense",
              confidence: t.confidence || 0.95,
              isRecurring: !!t.isRecurring,
              type: t.amount > 0 ? "expense" : "income"
            }));
            setTransactions(mapped);
          }
        }
        
        // Refresh health and spending data
        const [healthRes, spendingRes] = await Promise.all([
          fetch("/api/v1/analysis/health").catch(() => null),
          fetch("/api/v1/analysis/spending").catch(() => null),
        ]);
        
        if (healthRes && healthRes.ok) {
          const json = await healthRes.json();
          if (json.data && typeof json.data.score === 'number') {
            setApiHealthScore(json.data.score);
            setApiInsights(json.data.insights || []);
          }
        }

        if (spendingRes && spendingRes.ok) {
          const json = await spendingRes.json();
          if (json.data) {
            setApiSpending(json.data);
          }
        }

        setTimeout(() => {
          setIsParsing(false);
          setIsUploadModalOpen(false);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 4000);
        }, 800);
      } else {
        alert("Failed to import CSV");
        setIsParsing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error importing CSV");
      setIsParsing(false);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = { role: "user" as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Based on your spending patterns, your top expense category is Food & Dining ($420/mo). Cutting food delivery by 20% will save you $84/mo ($1,008/yr).";
      if (textToSend.toLowerCase().includes("subscription")) {
        reply = `You have ${recurringBills.length} recurring subscriptions totaling $${recurringBills.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}/mo. You can cancel unused trials to save $240/yr.`;
      } else if (textToSend.toLowerCase().includes("save")) {
        reply = `If you reduce Dining Out and Subscriptions by 25%, your projected 3-year compound savings will grow to +$11,520!`;
      }

      setChatMessages(prev => [...prev, { role: "assistant", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "transactions", label: "Transactions", icon: CreditCard, badge: `${transactions.length}` },
    { id: "budget", label: "Budgets & Limits", icon: PieChart, badge: null },
    { id: "subscriptions", label: "Silent Bills", icon: Bell, badge: `${recurringBills.length}` },
    { id: "simulator", label: "Savings Simulator", icon: SlidersHorizontal, badge: "AI" },
    { id: "goals", label: "Savings Goals", icon: Target, badge: null },
    { id: "ai", label: "AI Advisor", icon: Bot, badge: "Live" },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ] as const;

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
          <a href="/">
            <img src="/logofinal-bgremoved.png" alt="Koshin" className="h-8 w-auto object-contain scale-[3] origin-left ml-2" />
          </a>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-ink hover:bg-offwhite rounded-xl border border-hairline transition-all"
        >
          {sidebarOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={navItems}
        healthScore={healthScore}
        healthRingColor={healthRingColor}
        isDashboardPage={isDashboardPage}
      />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 bg-offwhite/30 h-full overflow-hidden">
        
        {/* Top Floating SaaS Header Bar */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-hairline bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="display text-2xl font-bold text-ink tracking-tight">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          {/* Quick Action Pill Bar */}
          <div className="flex items-center gap-3">
            {activeTab === "transactions" && (
              <div className="flex items-center gap-2 bg-white border border-hairline shadow-xs rounded-full px-4 py-2 max-w-[240px] w-full">
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

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-purple hover:bg-purple/90 text-white text-xs font-bold transition-all shadow-md hover:shadow-purple/25 cursor-pointer"
            >
              <UploadCloud className="size-4 text-lime-300" />
              <span>+ Scan Receipt</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple/30 bg-purple/10 text-purple text-xs font-semibold hover:bg-purple/20 transition-all"
            >
              <Bot className="size-4" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Content Area with Skeleton Loader */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8" data-lenis-prevent="true">
          
          {/* INITIAL GLASS SHIMMER LOADER */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-3xl bg-white border border-hairline shadow-sm space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-6 text-purple animate-spin" />
                    <div className="h-4 w-64 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-12 w-3/4 bg-gray-200 rounded-2xl" />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="h-20 bg-gray-100 rounded-xl" />
                    <div className="h-20 bg-gray-100 rounded-xl" />
                    <div className="h-20 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <>
              {/* Success Banner */}
              <AnimatePresence>
                {uploadSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 shadow-sm text-emerald-900"
                  >
                    <div className="size-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm text-white">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold">Statement Ingestion Complete</div>
                      <div className="text-[12px] opacity-80 mt-0.5">Koshin NLP categorizer structured all transactions and updated your Financial Health Score.</div>
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

                  {/* ── TAB 1: OVERVIEW DASHBOARD ── */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">

                      {/* HIGH-IMPACT HERO FINANCIAL BANNER */}
                      <div className="rounded-3xl bg-gradient-to-br from-ink via-navy to-black text-white p-8 sm:p-10 shadow-2xl relative border border-white/10 overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="absolute top-0 right-0 size-80 bg-purple/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Left Info */}
                        <div className="space-y-4 max-w-xl relative z-10">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/20 border border-lime/30 text-lime text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="size-3.5" /> Koshin AI Health Audit
                          </div>

                          <h3 className="display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Financial Health Score: <span className="text-lime">{healthScore}/100</span>
                          </h3>

                          <p className="text-sm text-white/70 leading-relaxed font-normal">
                            You have <strong className="text-white">{healthRatingText}</strong> reserves with a {savingsRate}% savings rate. Your projected financial runway is <strong className="text-lime">14.2 months</strong>.
                            {apiInsights.length > 0 && (
                              <span className="block mt-2 text-lime/90 italic text-xs">
                                💡 Insights: {apiInsights[0]}
                              </span>
                            )}
                          </p>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <button
                              onClick={() => setIsUploadModalOpen(true)}
                              className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-2.5 text-xs font-extrabold text-white hover:scale-105 transition-transform shadow-md cursor-pointer"
                            >
                              <UploadCloud className="size-4" />
                              <span>Import New Statement</span>
                            </button>

                            <button
                              onClick={() => setActiveTab("ai")}
                              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                            >
                              <Bot className="size-4 text-lime" />
                              <span>Advisor Recommendations</span>
                            </button>
                          </div>
                        </div>

                        {/* Right Gauge Widget */}
                        <div className="relative z-10 flex items-center justify-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 shrink-0 w-full sm:w-auto">
                          <div className="text-center space-y-2">
                            <span className="text-xs font-mono text-white/70 uppercase tracking-widest block">Net Savings Rate</span>
                            <div className="display text-4xl font-extrabold text-lime">+{savingsRate}%</div>
                            <span className="text-[11px] font-semibold text-white/80 bg-white/10 px-3 py-1 rounded-full inline-block">
                              +4.2% vs Last Month
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stat Cards Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <MetricCard
                          title="Monthly Income"
                          value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<CheckCircle2 className="size-3.5" />}
                          trendIcon={<ArrowDownLeft className="size-4" />}
                          trendLabel="Auto-Verified Deposits"
                          colorTheme="cyan"
                        />

                        <MetricCard
                          title="Total Expenses"
                          value={`$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<CreditCard className="size-3.5" />}
                          trendIcon={<ArrowUpRight className="size-4" />}
                          trendLabel={apiSpending && apiSpending.monthOverMonthChange !== undefined 
                            ? `${apiSpending.monthOverMonthChange > 0 ? '+' : ''}${apiSpending.monthOverMonthChange.toFixed(1)}% vs Last Month` 
                            : `${transactions.filter(t => t.type === 'expense').length} Items Tracked`}
                          colorTheme="pinkish"
                        />

                        <MetricCard
                          title="Net Reserve"
                          value={`${netSavings >= 0 ? '+' : ''}$${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<Zap className="size-3.5" />}
                          trendIcon={<Wallet className="size-4" />}
                          trendLabel={`${savingsRate}% Savings Rate`}
                          colorTheme="purple"
                          isNetReserve={true}
                        />
                      </div>

                      {/* EMERGENCY FINANCIAL RUNWAY CLOCK WIDGET */}
                      <div className="rounded-3xl border border-hairline bg-white p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                        <div className="flex items-start gap-4">
                          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple shrink-0">
                            <ShieldCheck className="size-6 text-purple" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-widest text-purple">Emergency Buffer</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% Protected</span>
                            </div>
                            <h4 className="display text-2xl font-extrabold text-ink flex items-center gap-2">
                              🛡️ Financial Runway: <span className="text-purple">14.2 Months</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              &quot;If all income stopped today, your emergency fund would cover your living expenses until <strong className="text-ink font-semibold">October 2027</strong>.&quot;
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-hairline">
                          <button
                            onClick={() => setActiveTab("simulator")}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02] shadow-sm cursor-pointer"
                          >
                            <SlidersHorizontal className="size-3.5 text-lime" />
                            <span>Test &quot;What-If&quot; Simulator</span>
                          </button>
                        </div>
                      </div>

                      {/* Spending Breakdown & Recent Feed */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8 rounded-2xl border border-hairline bg-white p-7 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="display text-lg font-bold text-ink">Spending Allocation</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">Koshin NLP Categorization Engine</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {Object.keys(categoryBreakdown).length === 0 ? (
                              <div className="p-8 text-center bg-offwhite/50 border border-hairline rounded-xl text-xs text-muted-foreground">
                                No spending categories to display yet. Upload a statement to calculate allocation.
                              </div>
                            ) : (
                              Object.entries(categoryBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, amount]) => {
                                  const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                                  const cfg = getCatConfig(cat);
                                  const Icon = cfg.icon;
                                  return (
                                    <div key={cat} className="space-y-1.5">
                                      <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="flex items-center gap-2 text-ink">
                                          <Icon className={`size-4 ${cfg.color}`} /> {cat}
                                        </span>
                                        <span className="text-ink font-bold">${amount.toFixed(2)} ({pct}%)</span>
                                      </div>
                                      <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden border border-hairline">
                                        <div className={`h-full bg-gradient-to-r ${cfg.gradient} to-purple rounded-full`} style={{ width: `${pct}%` }} />
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        </div>

                        {/* Recent Activity Mini List */}
                        <div className="xl:col-span-4 rounded-2xl border border-hairline bg-white p-7 shadow-sm space-y-4">
                          <h3 className="display text-lg font-bold text-ink">Recent Activity</h3>
                          <div className="space-y-3">
                            {transactions.length === 0 ? (
                              <div className="p-8 text-center bg-offwhite/50 border border-hairline rounded-xl text-xs text-muted-foreground">
                                No recent activity. Scan a receipt or import a statement to get started.
                              </div>
                            ) : (
                              transactions.slice(0, 5).map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-offwhite/50 border border-hairline text-xs">
                                  <div>
                                    <div className="font-bold text-ink truncate max-w-[140px]">{tx.merchant}</div>
                                    <div className="text-[10px] text-muted-foreground">{tx.date} • {tx.category}</div>
                                  </div>
                                  <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-ink'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ── OTHER DASHBOARD TABS ── */}
                  {activeTab === "transactions" && (
                    <TransactionTable transactions={transactions.filter(t => t.merchant.toLowerCase().includes(searchTerm.toLowerCase()))} />
                  )}

                  {activeTab === "budget" && (
                    <BudgetView categoryBreakdown={categoryBreakdown} />
                  )}

                  {activeTab === "subscriptions" && (
                    <SubscriptionsView recurringBills={recurringBills} />
                  )}

                  {activeTab === "simulator" && (
                    <SimulatorView
                      foodCut={foodCut}
                      setFoodCut={setFoodCut}
                      subCut={subCut}
                      setSubCut={setSubCut}
                      shoppingCut={shoppingCut}
                      setShoppingCut={setShoppingCut}
                      totalExpenses={totalExpenses}
                    />
                  )}

                  {activeTab === "goals" && (
                    <GoalsView />
                  )}

                  {activeTab === "ai" && (
                    <div className="rounded-3xl border border-hairline bg-white p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
                      <div className="flex items-center gap-3 pb-4 border-b border-hairline">
                        <div className="size-10 rounded-2xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center">
                          <Bot className="size-6" />
                        </div>
                        <div>
                          <h3 className="display text-xl font-bold text-ink">Koshin Financial AI Advisor</h3>
                          <p className="text-xs text-muted-foreground">Conversational Financial Assistant</p>
                        </div>
                      </div>

                      {/* Chat Messages Stage */}
                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-ink text-white rounded-br-none'
                                : 'bg-offwhite text-ink border border-hairline rounded-bl-none'
                            }`}>
                              <p>{msg.text}</p>
                              <span className="text-[9px] opacity-60 mt-1.5 block text-right">{msg.time}</span>
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex items-center gap-2 text-xs text-purple font-medium p-3 bg-purple/10 rounded-xl w-max animate-pulse">
                            <Bot className="size-4 animate-spin" /> Koshin AI is thinking...
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Quick Prompt Pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => handleSendMessage(undefined, "Where did I spend the most this month?")}
                          className="px-3 py-1.5 rounded-full bg-offwhite hover:bg-purple/10 border border-hairline hover:border-purple/30 text-xs font-semibold text-ink transition-all"
                        >
                          &quot;Where did I spend the most?&quot;
                        </button>
                        <button
                          onClick={() => handleSendMessage(undefined, "How can I save $340/mo?")}
                          className="px-3 py-1.5 rounded-full bg-offwhite hover:bg-purple/10 border border-hairline hover:border-purple/30 text-xs font-semibold text-ink transition-all"
                        >
                          &quot;How can I save $340/mo?&quot;
                        </button>
                      </div>

                      {/* Input Box */}
                      <form onSubmit={e => handleSendMessage(e)} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Ask Koshin AI about your transactions or savings..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          className="flex-1 px-5 py-3 rounded-full border border-hairline bg-offwhite text-xs text-ink outline-none focus:border-purple"
                        />
                        <button type="submit" className="p-3 rounded-full bg-purple hover:bg-purple/90 text-white transition-colors cursor-pointer shadow-sm">
                          <Send className="size-4" />
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <SettingsView />
                  )}

                </motion.div>
              </AnimatePresence>
            </>
          )}

        </div>

      </div>

      {/* STATEMENT UPLOAD MODAL WITH REALISTIC 3-STEP PARSING PROGRESS */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full border border-hairline shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <div className="flex items-center gap-2 text-ink font-bold">
                  <UploadCloud className="size-5 text-purple" />
                  <span>AI Receipt & Statement Scanner</span>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-full hover:bg-offwhite text-muted-foreground hover:text-ink transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {!isParsing ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple/30 rounded-2xl p-10 text-center bg-purple/5 hover:border-purple cursor-pointer transition-all space-y-3"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <UploadCloud className="size-12 text-purple mx-auto animate-bounce" />
                  <div>
                    <p className="text-sm font-bold text-ink">Upload CSV Statement</p>
                    <p className="text-xs text-muted-foreground mt-1">Import your transactions from a CSV file</p>
                  </div>
                  <button className="px-5 py-2 rounded-full bg-purple hover:bg-purple/90 text-white text-xs font-bold transition-colors inline-block mt-2 cursor-pointer shadow-md">
                    Select File
                  </button>
                </div>
              ) : (
                <div className="space-y-5 text-center py-6">
                  <Sparkles className="size-10 text-purple mx-auto animate-spin" />
                  <div className="space-y-2">
                    <h4 className="display text-lg font-bold text-ink">Scanning with AI OCR</h4>
                    <p className="text-xs font-mono text-purple font-semibold">
                      {parsingStep === 1 && "Step 1/3: Extracting text from image..."}
                      {parsingStep === 2 && "Step 2/3: Categorizing Merchant & parsing amounts..."}
                      {parsingStep === 3 && "Step 3/3: Transaction Synced!"}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-offwhite rounded-full overflow-hidden border border-hairline">
                    <div
                      className="h-full bg-purple transition-all duration-700"
                      style={{ width: parsingStep === 1 ? "33%" : parsingStep === 2 ? "66%" : "100%" }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-hairline">
                <span className="flex items-center gap-1">
                  <Lock className="size-3.5 text-emerald-600" /> Bank-Grade 256-Bit Security
                </span>
                <span>Max File Size: 25MB</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
