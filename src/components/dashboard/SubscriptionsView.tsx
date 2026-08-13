"use client";

import { motion } from "motion/react";
import { Bell, RefreshCw } from "lucide-react";
import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";

interface SubscriptionsViewProps {
  recurringBills: Transaction[];
}

export function SubscriptionsView({ recurringBills }: SubscriptionsViewProps) {
  return (
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
  );
}
