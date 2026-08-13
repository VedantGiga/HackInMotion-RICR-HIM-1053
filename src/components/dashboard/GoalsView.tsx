"use client";

import { PlusCircle, ShieldCheck, Car } from "lucide-react";

export function GoalsView() {
  return (
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
  );
}
