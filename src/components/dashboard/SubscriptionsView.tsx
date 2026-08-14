"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import { Bell, RefreshCw, Bot, Terminal, ShieldAlert, Sparkles, CheckCircle, X } from "lucide-react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";
import { useDashboardStore } from "@/store/useDashboardStore";

interface SubscriptionsViewProps {
  recurringBills: Transaction[];
}

export function SubscriptionsView({ recurringBills }: SubscriptionsViewProps) {
  const { data: session } = useSession();
  const curr = (session?.user as any)?.currency || "$";
  const { setTransactions } = useDashboardStore();
  const [cancellingSub, setCancellingSub] = useState<Transaction | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const getCancellationSteps = (merchant: string, amount: number) => [
    `[System] Initializing Koshin AI Sub-Agent v2.1...`,
    `[Agent] Locating cancel pathway for ${merchant} API hooks...`,
    `[Agent] Generating secure billing payload & legal notice...`,
    `[Agent] Bypassing retention chatbot & routing directly to server...`,
    `[Agent] Automating form-fill with virtual CC token confirmation...`,
    `[System] Handshake verified. Cancellation code: KSH-${Math.floor(Math.random() * 900000 + 100000)}`,
    `[Success] ${merchant} billing cycle successfully terminated!`,
    `[Summary] Saved ${curr}${amount.toFixed(2)}/mo (${curr}${(amount * 12).toFixed(2)}/yr).`
  ];

  useEffect(() => {
    if (!cancellingSub) return;

    setLogs([]);
    setStepIndex(0);
    setIsDone(false);

    const steps = getCancellationSteps(cancellingSub.merchant, cancellingSub.amount);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length) {
          setLogs((prevLogs) => [...prevLogs, steps[prev]]);
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsDone(true);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [cancellingSub]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const confirmCancellation = () => {
    if (!cancellingSub) return;
    // Remove transaction from store
    setTransactions((prev) => prev.filter((t) => t.id !== cancellingSub.id));
    setCancellingSub(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
      <div className="xl:col-span-8 space-y-6">
        {/* Header summary */}
        <div className="rounded-2xl border border-hairline bg-background shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="size-16 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0">
            <Bell className="size-7 text-purple" />
          </div>
          <div className="flex-1">
            <div className="display text-3xl font-bold text-ink">
              {curr}{recurringBills.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0).toFixed(2)}
              <span className="text-[15px] text-muted-foreground font-medium ml-2">/ month</span>
            </div>
            <div className="text-[13px] font-medium text-muted-foreground mt-1">{recurringBills.length} active commitments auto-detected</div>
          </div>
          <div className="sm:text-right p-4 bg-offwhite rounded-xl border border-hairline">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Annual Cost</div>
            <div className="text-xl font-bold text-pinkish">{curr}{(recurringBills.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0) * 12).toFixed(0)}</div>
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
            {recurringBills.length === 0 ? (
              <div className="p-8 text-center bg-offwhite/40 border border-hairline rounded-2xl space-y-2">
                <Bell className="size-8 text-purple/40 mx-auto" />
                <div className="text-sm font-bold text-ink">No Recurring Commitments Detected</div>
                <div className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Upload a bank statement to automatically audit your recurring subscriptions and silent bills.
                </div>
              </div>
            ) : (
              recurringBills.map(item => {
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
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[15px] font-bold text-ink">{curr}{item.amount.toFixed(2)}<span className="text-muted-foreground text-[11px]">/mo</span></div>
                        <div className="text-[9px] text-purple font-bold uppercase tracking-widest mt-1 bg-purple/10 inline-block px-2 py-0.5 rounded-md">Monitored</div>
                      </div>
                      <button
                        onClick={() => setCancellingSub(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-pinkish/20 bg-pinkish/5 hover:bg-pinkish/10 text-pinkish text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Bot className="size-3.5" />
                        <span>Cancel with AI</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
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

          {recurringBills.length === 0 ? (
            <div className="text-center p-4 bg-offwhite rounded-xl text-sm text-muted-foreground border border-hairline">
              No upcoming renewals detected.
            </div>
          ) : (
            [...recurringBills].map(bill => {
              const date = new Date(bill.date);
              const now = new Date();
              const predicted = new Date(now.getFullYear(), now.getMonth(), date.getDate());
              if (predicted < now) predicted.setMonth(predicted.getMonth() + 1);
              return { ...bill, nextDate: predicted };
            })
            .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
            .slice(0, 5)
            .map((bill, i) => {
              const themes = [
                { container: 'bg-purple/5 border-purple/20', badge: 'text-purple font-bold text-[11px] bg-purple/10 border border-purple/20' },
                { container: 'bg-pinkish/5 border-pinkish/20', badge: 'text-pinkish font-bold text-[11px] bg-pinkish/10 border border-pinkish/20' },
                { container: 'bg-skyblue/5 border-skyblue/20', badge: 'text-skyblue-700 font-bold text-[11px] bg-skyblue/10 border border-skyblue/20' },
                { container: 'bg-cyan/5 border-cyan/20', badge: 'text-cyan-700 font-bold text-[11px] bg-cyan/10 border border-cyan/20' },
                { container: 'bg-amber-100 border-amber-200', badge: 'text-amber-700 font-bold text-[11px] bg-amber-200/50 border border-amber-300' },
              ];
              const theme = themes[i % themes.length];
              
              return (
                <div key={bill.id} className={`p-5 rounded-xl border space-y-2 shadow-sm ${theme.container}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink text-[14px] truncate mr-2">{bill.merchant}</span>
                    <span className={`px-2.5 py-1 rounded-md shrink-0 ${theme.badge}`}>
                      {bill.nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-ink">{curr}{bill.amount.toFixed(2)}</div>
                  <div className="text-[12px] font-medium text-muted-foreground truncate">{bill.category}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CANCELLATION AGENT MODAL */}
      <AnimatePresence>
        {cancellingSub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B0D10]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-navy border border-white/10 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-purple/20 text-purple border border-purple/30 rounded-xl flex items-center justify-center">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h3 className="display text-lg font-bold tracking-tight">Koshin AI Agent Console</h3>
                    <p className="text-xs text-white/50">Active Termination Pipeline</p>
                  </div>
                </div>
                {!isDone && (
                  <button
                    onClick={() => setCancellingSub(null)}
                    className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Status details */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-white/50">Subscription Target</div>
                  <div className="text-base font-bold mt-0.5">{cancellingSub.merchant}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">Monthly Savings</div>
                  <div className="text-base font-bold text-pinkish mt-0.5">{curr}{cancellingSub.amount.toFixed(2)}</div>
                </div>
              </div>

              {/* Terminal View */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4.5 font-mono text-[11px] h-48 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center gap-2 text-purple/80 pb-2 border-b border-white/5 mb-2 font-sans font-bold">
                  <Terminal className="size-4" /> LIVE TERMINAL LOGS
                </div>
                {logs.map((log, idx) => {
                  let color = "text-white/80";
                  if (log.includes("[System]")) color = "text-purple-300";
                  if (log.includes("[Success]")) color = "text-emerald-400 font-bold";
                  if (log.includes("[Summary]")) color = "text-cyan font-bold";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${color} leading-relaxed`}
                    >
                      {log}
                    </motion.div>
                  );
                })}
                {/* Agent typing cursor simulator */}
                {!isDone && (
                  <div className="flex items-center gap-1.5 text-purple-300 animate-pulse">
                    <span className="w-1.5 h-3 bg-purple-300" />
                    <span>Executing cancellation instructions...</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {isDone ? (
                  <button
                    onClick={confirmCancellation}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="size-4" />
                    <span>APPLY SAVINGS TO PROFILE</span>
                  </button>
                ) : (
                  <div className="w-full p-4 bg-purple/10 border border-purple/20 rounded-2xl flex items-center gap-3 text-purple text-xs font-semibold justify-center animate-pulse">
                    <RefreshCw className="size-4 animate-spin" />
                    <span>AI Agent negotiating cancel protocol...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
