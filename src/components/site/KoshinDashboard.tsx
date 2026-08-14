"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  TrendingUp,
  CreditCard,
  PieChart,
  ShieldCheck,
  Sparkles,
  Zap,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  Send,
  Bell,
  SlidersHorizontal,
  Bot,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  LayoutDashboard,
  X,
  Search,
  Menu,
  Coffee,
  ShoppingBag,
  Home,
  Tv,
  Car,
  Lightbulb,
  UploadCloud,
  Download,
  Lock,
  Trash2,
  FileSpreadsheet,
  Target,
  Loader2
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
import { getCurrencySymbol } from "@/lib/utils";

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
    searchTerm, setSearchTerm,
    uploadSuccess, setUploadSuccess,
    foodCut, setFoodCut,
    subCut, setSubCut,
    shoppingCut, setShoppingCut
  } = useDashboardStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  // Manual Transaction Form state
  const [manualDesc, setManualDesc] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);
  const [manualCategory, setManualCategory] = useState("Food & Dining");
  const [manualType, setManualType] = useState<"expense" | "income">("expense");
  const [manualIsRecurring, setManualIsRecurring] = useState(false);

  const { data: session } = useSession();
  const [curr, setCurr] = useState((session?.user as any)?.currency || "$");

  useEffect(() => {
    if ((session?.user as any)?.currency) {
      setCurr((session?.user as any).currency);
    }
  }, [session]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("koshin_onboarded", "true");
    }
  }, []);
  const [parsingStep, setParsingStep] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [apiHealthScore, setApiHealthScore] = useState<number | null>(null);
  const [apiInsights, setApiInsights] = useState<string[]>([]);
  const [apiSpending, setApiSpending] = useState<any>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFileImport(file);
    }
  };

  useEffect(() => {
    setCurr(getCurrencySymbol());
  }, []);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    { role: "assistant", text: "Hello! I am Koshin AI, your personal financial co-pilot. Ask me anything about your bank statement data, recurring bills, or savings strategy!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Live API Integration function
  const loadApiData = async () => {
    try {
      const [txRes, healthRes, spendingRes] = await Promise.all([
        fetch("/api/v1/transactions").catch(() => null),
        fetch("/api/v1/analysis/health").catch(() => null),
        fetch("/api/v1/analysis/spending").catch(() => null),
      ]);

      if (txRes && txRes.ok) {
        const json = await txRes.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped = json.data.map((t: any) => ({
            id: t.id,
            date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            merchant: t.merchant || t.description,
            amount: t.amount,
            category: t.category?.name || "General Expense",
            confidence: t.confidence || 0.95,
            isRecurring: !!t.isRecurring,
            type: (t.category?.name === "Income" || t.category?.type === "income") ? "income" : "expense"
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
      console.error("Error loading API data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApiData();
  }, []);

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
    if (transactions.length === 0) return 0;

    const savings = totalIncome - totalExpenses;
    if (totalIncome > 0) {
      const rate = savings / totalIncome;
      if (rate < 0.1) score -= 20;
    } else {
      score -= 25;
    }

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
  const healthRingColor = healthScore >= 80 ? "text-lime" : healthScore >= 65 ? "text-purple" : "text-orange-500";

  const recurringBills = useMemo(() => {
    return transactions.filter(t => t.isRecurring);
  }, [transactions]);

  const runwayData = useMemo(() => {
    if (totalExpenses === 0) {
      return { months: "Infinite", targetDate: "N/A" };
    }
    const estimatedLiquidReserve = totalIncome > 0 ? (totalIncome * 3 + netSavings) : Math.max(netSavings, 0);
    const months = Math.max(1, parseFloat((estimatedLiquidReserve / totalExpenses).toFixed(1)));
    const now = new Date();
    const future = new Date(now.getFullYear(), now.getMonth() + Math.round(months), 1);
    const targetDate = future.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { months: `${months} Months`, targetDate };
  }, [totalIncome, totalExpenses, netSavings]);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<Array<{
    id: string;
    date: string;
    description: string;
    merchant: string;
    category: string;
    confidence: number;
    amount: number;
    type: "expense" | "income";
    isRecurring: boolean;
    selected: boolean;
  }>>([]);
  const [isImportingBatch, setIsImportingBatch] = useState(false);

  const handleToggleSelectAll = (select: boolean) => {
    setPreviewItems(prev => prev.map(item => ({ ...item, selected: select })));
  };

  const handleToggleItemSelect = (id: string) => {
    setPreviewItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleItemCategoryChange = (id: string, category: string) => {
    setPreviewItems(prev => prev.map(item => item.id === id ? { ...item, category } : item));
  };

  const handleConfirmBatchImport = async () => {
    const selectedList = previewItems.filter(i => i.selected);
    if (selectedList.length === 0) {
      alert("Please select at least one transaction to import.");
      return;
    }

    try {
      setIsImportingBatch(true);
      const res = await fetch("/api/v1/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedList }),
      });

      if (res.ok) {
        setIsPreviewModalOpen(false);
        setPreviewItems([]);
        await loadApiData();
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      } else {
        alert("Failed to batch import selected transactions.");
      }
    } catch (err) {
      console.error("Error batch importing transactions:", err);
    } finally {
      setIsImportingBatch(false);
    }
  };

  const processFileImport = async (file: File) => {
    setIsParsing(true);
    setParsingStep(1);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setParsingStep(2);
      const res = await fetch("/api/v1/transactions/import?preview=true", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.preview || [];
        setParsingStep(3);
        setIsParsing(false);
        setIsUploadModalOpen(false);

        if (items.length > 0) {
          setPreviewItems(items);
          setIsPreviewModalOpen(true);
        } else {
          alert("No transaction items were extracted from the statement.");
        }
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Failed to parse bank statement");
        setIsParsing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error parsing bank statement file");
      setIsParsing(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFileImport(file);
  };

  const handleLoadSampleStatement = async () => {
    try {
      setIsParsing(true);
      setParsingStep(1);
      const res = await fetch("/sample-bank-statement.csv");
      const blob = await res.blob();
      const sampleFile = new File([blob], "sample-bank-statement.csv", { type: "text/csv" });
      await processFileImport(sampleFile);
    } catch (err) {
      console.error("Error loading sample statement:", err);
      setIsParsing(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDesc || !manualAmount) return;

    try {
      const res = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: manualDesc,
          amount: parseFloat(manualAmount) * (manualType === "expense" ? 1 : -1),
          date: manualDate,
          categoryName: manualType === "income" ? "Income" : manualCategory,
          isRecurring: manualIsRecurring,
        }),
      });

      if (res.ok) {
        setIsManualAddOpen(false);
        setManualDesc("");
        setManualAmount("");
        await loadApiData();
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleClearAllTransactions = async () => {
    if (!confirm("Are you sure you want to clear all imported bank statement data?")) return;
    try {
      await fetch("/api/v1/transactions", { method: "DELETE" });
      setTransactions([]);
      await loadApiData();
    } catch (err) {
      console.error("Error clearing transactions:", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: "user" as const, text: textToSend, time: timeStr };
    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const json = await res.json();
        const replyText = json.data?.reply || "I analyzed your bank statement data and updated your health audit.";
        setChatMessages(prev => [...prev, { role: "assistant", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", text: "Unable to process request right now. Please try again.", time: timeStr }]);
      }
    } catch (err) {
      console.error("Error communicating with AI Chat:", err);
      setChatMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again later.", time: timeStr }]);
    } finally {
      setIsTyping(false);
    }
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
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="display text-2xl font-bold text-ink tracking-tight">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>

            {activeTab === "transactions" && (
              <div className="flex items-center gap-2 bg-white border border-hairline shadow-xs rounded-full px-4 py-2 max-w-[260px] sm:w-[280px]">
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
          </div>

          {/* Quick Action Pill Bar */}
          <div className="flex items-center gap-3">
            {activeTab === "transactions" && (
              <>
                <button
                  onClick={() => setIsManualAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-purple/30 bg-purple/10 text-purple text-xs font-bold hover:bg-purple/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="size-3.5" />
                  <span>+ Manual Line</span>
                </button>
                {transactions.length > 0 && (
                  <button
                    onClick={handleClearAllTransactions}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-pinkish/20 bg-pinkish/5 text-pinkish text-xs font-bold hover:bg-pinkish/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setIsUploadModalOpen(true)}
              aria-label="Import Bank Statement"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple hover:bg-purple/90 text-white text-xs font-extrabold transition-all shadow-md hover:shadow-purple/25 cursor-pointer ring-2 ring-purple/20"
            >
              <UploadCloud className="size-4 text-lime-300" />
              <span>+ Import Bank Statement</span>
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

                          <h2 className="display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Your Financial Health is <span className="text-lime">{healthScore}/100</span>
                          </h2>

                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                            {apiInsights.length > 0 
                              ? apiInsights[0]
                              : transactions.length === 0
                              ? "Upload a bank CSV or scan a PDF statement to run your automated financial audit!"
                              : `Based on your ${transactions.length} real line items, your monthly savings rate is ${savingsRate}%.`}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                              onClick={() => setIsUploadModalOpen(true)}
                              className="px-5 py-2.5 rounded-full bg-lime text-black font-extrabold text-xs hover:bg-lime/90 transition-transform hover:scale-[1.02] shadow-lg shadow-lime/20 cursor-pointer"
                            >
                              + Import Bank Statement
                            </button>
                            <button
                              onClick={() => setActiveTab("transactions")}
                              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer"
                            >
                              View All {transactions.length} Items
                            </button>
                          </div>
                        </div>

                        {/* Right Gauge Badge */}
                        <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shrink-0 w-full sm:w-auto">
                          <div className="relative size-28 flex items-center justify-center">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-white/10"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={healthRingColor}
                                strokeDasharray={`${healthScore}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-2xl font-black">{healthScore}</span>
                              <span className="text-[9px] uppercase tracking-widest text-white/50">Score</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold mt-3 text-white/90">
                            {healthScore >= 80 ? "Optimal Reserve" : healthScore >= 65 ? "Good Standings" : "Needs Review"}
                          </span>
                        </div>
                      </div>

                      {/* 3 TOP LEVEL METRIC CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard
                          title="Total Income"
                          value={`${curr}${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<CheckCircle2 className="size-3.5" />}
                          trendIcon={<ArrowDownLeft className="size-4" />}
                          trendLabel="Verified Statement Deposits"
                          colorTheme="cyan"
                        />

                        <MetricCard
                          title="Total Expenses"
                          value={`${curr}${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<CreditCard className="size-3.5" />}
                          trendIcon={<ArrowUpRight className="size-4" />}
                          trendLabel={apiSpending && apiSpending.monthOverMonthChange !== undefined 
                            ? `${apiSpending.monthOverMonthChange > 0 ? '+' : ''}${apiSpending.monthOverMonthChange.toFixed(1)}% vs Last Month` 
                            : `${transactions.filter(t => t.type === 'expense').length} Line Items`}
                          colorTheme="pinkish"
                        />

                        <MetricCard
                          title="Net Reserve"
                          value={`${netSavings >= 0 ? '+' : ''}${curr}${Math.abs(netSavings).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          icon={<Zap className="size-3.5" />}
                          trendIcon={<DollarSign className="size-4" />}
                          trendLabel={`${savingsRate}% Savings Rate`}
                          colorTheme="purple"
                          isNetReserve={true}
                        />
                      </div>

                      {/* EMERGENCY FINANCIAL RUNWAY WIDGET */}
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
                              🛡️ Financial Runway: <span className="text-purple">{runwayData.months}</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              &quot;If all income stopped today, your cash reserves would cover living expenses until <strong className="text-ink font-semibold">{runwayData.targetDate}</strong>.&quot;
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
                              <p className="text-xs text-muted-foreground mt-0.5">Koshin Engine Categorization</p>
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
                                        <span className="text-ink font-bold">{curr}{amount.toFixed(2)} ({pct}%)</span>
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
                                No recent activity. Scan a receipt or import a bank statement to get started.
                              </div>
                            ) : (
                              transactions.slice(0, 6).map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-offwhite/50 border border-hairline text-xs">
                                  <div>
                                    <div className="font-bold text-ink truncate max-w-[140px]">{tx.merchant}</div>
                                    <div className="text-[10px] text-muted-foreground">{tx.date} • {tx.category}</div>
                                  </div>
                                  <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-ink'}`}>
                                    {tx.type === 'income' ? '+' : '-'}{curr}{tx.amount.toFixed(2)}
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
                    <BudgetView transactions={transactions} />
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
                          <p className="text-xs text-muted-foreground">Conversational Advisor grounded in your bank statement logs</p>
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
                            <Bot className="size-4 animate-spin" /> Koshin AI analyzing statement context...
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Quick Prompt Pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => handleSendMessage(undefined, "Where did I spend the most this month?")}
                          className="px-3 py-1.5 rounded-full bg-offwhite hover:bg-purple/10 border border-hairline hover:border-purple/30 text-xs font-semibold text-ink transition-all cursor-pointer"
                        >
                          &quot;Where did I spend the most?&quot;
                        </button>
                        <button
                          onClick={() => handleSendMessage(undefined, "How can I save $340/mo?")}
                          className="px-3 py-1.5 rounded-full bg-offwhite hover:bg-purple/10 border border-hairline hover:border-purple/30 text-xs font-semibold text-ink transition-all cursor-pointer"
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

      {/* STATEMENT UPLOAD MODAL WITH 1-CLICK DEMO AND SAMPLE DOWNLOAD */}
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
                  <span>AI Bank Statement Scanner</span>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-full hover:bg-offwhite text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {!isParsing ? (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3 ${
                      isDragging
                        ? "border-purple bg-purple/15 scale-[1.02] shadow-xl"
                        : "border-purple/30 bg-purple/5 hover:border-purple"
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".csv, .pdf"
                      onChange={handleFileUpload}
                    />
                    <UploadCloud className={`size-10 mx-auto transition-all ${isDragging ? 'text-purple scale-125' : 'text-purple animate-bounce'}`} />
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {isDragging ? "Drop Bank CSV / PDF Statement Here!" : "Drag & Drop or Upload Bank CSV / PDF Statement"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drag any bank CSV, XLS, XLSX, or PDF statement file directly into this dropzone
                      </p>
                    </div>
                    <button className="px-5 py-2 rounded-full bg-purple hover:bg-purple/90 text-white text-xs font-bold transition-colors inline-block mt-2 cursor-pointer shadow-md">
                      Browse Files
                    </button>
                  </div>

                  {/* Quick Sample Test Options */}
                  <div className="p-4 rounded-2xl bg-offwhite/80 border border-hairline space-y-2.5 text-center">
                    <div className="text-xs font-bold text-ink flex items-center justify-center gap-1.5">
                      <Sparkles className="size-3.5 text-purple" />
                      <span>Want to test with sample bank data?</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleLoadSampleStatement}
                        className="px-4 py-2 rounded-full bg-ink hover:bg-purple text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="size-3.5 text-lime" />
                        <span>⚡ 1-Click Load Sample Bank CSV</span>
                      </button>
                      <a
                        href="/sample-bank-statement.csv"
                        download="sample-bank-statement.csv"
                        className="px-3 py-2 rounded-full border border-hairline hover:bg-white text-muted-foreground hover:text-ink text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Download className="size-3.5" />
                        <span>Download CSV</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 text-center py-6">
                  <Sparkles className="size-10 text-purple mx-auto animate-spin" />
                  <div className="space-y-2">
                    <h4 className="display text-lg font-bold text-ink">Analyzing Statement with NLP</h4>
                    <p className="text-xs font-mono text-purple font-semibold">
                      {parsingStep === 1 && "Step 1/3: Reading CSV / PDF text headers..."}
                      {parsingStep === 2 && "Step 2/3: Categorizing Merchants & calculating health score..."}
                      {parsingStep === 3 && "Step 3/3: Transactions Synced to Dashboard!"}
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

      {/* MANUAL TRANSACTION MODAL */}
      <AnimatePresence>
        {isManualAddOpen && (
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
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-hairline shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <h3 className="display text-lg font-bold text-ink flex items-center gap-2">
                  <PlusCircle className="size-5 text-purple" /> Add Manual Transaction
                </h3>
                <button onClick={() => setIsManualAddOpen(false)} className="p-1 rounded-full hover:bg-offwhite text-muted-foreground hover:text-ink">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Merchant / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whole Foods Market"
                    value={manualDesc}
                    onChange={e => setManualDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite/50 text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 45.50"
                      value={manualAmount}
                      onChange={e => setManualAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite/50 text-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Transaction Date</label>
                    <input
                      type="date"
                      required
                      value={manualDate}
                      onChange={e => setManualDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite/50 text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Type</label>
                    <select
                      value={manualType}
                      onChange={e => setManualType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite/50 text-ink"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>

                  {manualType === "expense" && (
                    <div className="space-y-1">
                      <label className="font-bold text-ink">Category</label>
                      <select
                        value={manualCategory}
                        onChange={e => setManualCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-hairline outline-none focus:border-purple bg-offwhite/50 text-ink"
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
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="manualRecurring"
                    checked={manualIsRecurring}
                    onChange={e => setManualIsRecurring(e.target.checked)}
                    className="rounded border-hairline text-purple focus:ring-purple"
                  />
                  <label htmlFor="manualRecurring" className="text-xs font-semibold text-ink cursor-pointer">
                    Is Recurring Monthly Bill?
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple hover:bg-purple/90 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                  >
                    Save Transaction Line Item
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATEMENT IMPORT PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-4xl w-full border border-hairline shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-hairline flex items-center justify-between bg-offwhite/50">
                <div>
                  <h3 className="display text-xl font-bold text-ink flex items-center gap-2">
                    <FileSpreadsheet className="size-5 text-purple" /> Statement Import Preview
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review extracted line items, categorization confidence scores, and toggle items before saving to SQLite.
                  </p>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-offwhite text-muted-foreground hover:text-ink cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="px-6 py-3 border-b border-hairline bg-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-semibold text-ink">
                  <button
                    onClick={() => handleToggleSelectAll(true)}
                    className="text-purple hover:underline cursor-pointer font-bold"
                  >
                    Select All ({previewItems.length})
                  </button>
                  <span className="text-hairline">|</span>
                  <button
                    onClick={() => handleToggleSelectAll(false)}
                    className="text-muted-foreground hover:text-ink cursor-pointer font-semibold"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="text-xs font-bold text-ink">
                  Selected: <span className="text-purple font-extrabold">{previewItems.filter((i) => i.selected).length}</span> of {previewItems.length} items
                </div>
              </div>

              {/* Table Body */}
              <div className="flex-1 max-h-[60vh] min-h-[300px] overflow-y-auto overflow-x-auto p-6 border-b border-hairline scrollbar-thin">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="sticky top-0 bg-white shadow-xs z-10">
                    <tr className="border-b border-hairline text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-2.5 px-3 text-center bg-white">Import</th>
                      <th className="py-2.5 px-3 bg-white">Date</th>
                      <th className="py-2.5 px-3 bg-white">Description</th>
                      <th className="py-2.5 px-3 bg-white">Category</th>
                      <th className="py-2.5 px-3 bg-white">AI Confidence</th>
                      <th className="py-2.5 px-3 text-right bg-white">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {previewItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-offwhite/50 transition-colors ${!item.selected ? "opacity-40 bg-gray-50" : ""}`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleItemSelect(item.id)}
                            className="rounded border-hairline text-purple focus:ring-purple cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-medium whitespace-nowrap text-muted-foreground">{item.date}</td>
                        <td className="py-3 px-3 font-bold text-ink">
                          {item.merchant || item.description}
                          {item.isRecurring && (
                            <span className="ml-2 text-[9px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded">
                              Recurring
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={item.category}
                            onChange={(e) => handleItemCategoryChange(item.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-hairline bg-white text-xs font-semibold text-ink focus:border-purple outline-none cursor-pointer"
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
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.confidence >= 0.9
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : item.confidence >= 0.75
                                ? "bg-purple/10 text-purple border-purple/20"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {Math.round(item.confidence * 100)}% Match
                          </span>
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                            item.type === "income" ? "text-emerald-600" : "text-ink"
                          }`}
                        >
                          {item.type === "income" ? "+" : "-"}{curr}
                          {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-hairline bg-offwhite/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  Total Selected Sum:{" "}
                  <span className="font-bold text-ink text-sm">
                    {curr}
                    {previewItems
                      .filter((i) => i.selected)
                      .reduce((acc, i) => acc + i.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-hairline hover:bg-white text-xs font-bold text-ink transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBatchImport}
                    disabled={isImportingBatch || previewItems.filter((i) => i.selected).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-purple hover:bg-purple/90 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isImportingBatch ? <Loader2 className="size-4 animate-spin" /> : "Confirm & Import to DB"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
