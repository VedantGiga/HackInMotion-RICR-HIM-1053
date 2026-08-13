"use client";

import { Activity, Coffee, Tv, ShoppingBag, ShieldCheck, TrendingUp, Target } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SimulatorViewProps {
  foodCut: number;
  setFoodCut: Dispatch<SetStateAction<number>>;
  subCut: number;
  setSubCut: Dispatch<SetStateAction<number>>;
  shoppingCut: number;
  setShoppingCut: Dispatch<SetStateAction<number>>;
  simFoodSavings: number;
  simSubSavings: number;
  simShopSavings: number;
  totalMonthlySimSavings: number;
  totalAnnualSimSavings: number;
}

export function SimulatorView({
  foodCut, setFoodCut,
  subCut, setSubCut,
  shoppingCut, setShoppingCut,
  simFoodSavings, simSubSavings, simShopSavings,
  totalMonthlySimSavings, totalAnnualSimSavings
}: SimulatorViewProps) {
  return (
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
  );
}
