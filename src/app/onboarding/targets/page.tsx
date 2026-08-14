"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, PiggyBank, TrendingDown, ActivitySquare } from "lucide-react";

export default function TargetsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>("save");
  const [spendingBudget, setSpendingBudget] = useState("");
  const [savingsTarget, setSavingsTarget] = useState("");
  const [emergencyTarget, setEmergencyTarget] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".progress-fill", 
        { width: "66%" }, 
        { width: "100%", duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
      
      gsap.fromTo(".reveal-elem", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save Spending Budget to DB
      if (spendingBudget.trim()) {
        await fetch("/api/v1/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: "General Expense",
            limit: parseFloat(spendingBudget.replace(/[^0-9\.]/g, "")),
          }),
        }).catch(() => null);
      }

      // 2. Save Savings Target to DB Goal table
      if (savingsTarget.trim()) {
        await fetch("/api/v1/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Monthly Savings Target",
            targetAmount: parseFloat(savingsTarget.replace(/[^0-9\.]/g, "")),
            currentAmount: 0,
          }),
        }).catch(() => null);
      }

      // 3. Save Emergency Fund Target if selected
      if (selectedGoal === "emergency" && emergencyTarget.trim()) {
        await fetch("/api/v1/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Emergency Reserve",
            targetAmount: parseFloat(emergencyTarget.replace(/[^0-9\.]/g, "")),
            currentAmount: 0,
          }),
        }).catch(() => null);
      }
    } catch (err) {
      console.error("Error saving onboarding targets to DB:", err);
    } finally {
      router.push("/onboarding/processing");
    }
  };

  const goals = [
    { id: "emergency", icon: ShieldAlert, title: "Build an Emergency Fund", desc: "Create a safety net for unexpected expenses." },
    { id: "save", icon: PiggyBank, title: "Save More", desc: "Build a stronger and more consistent saving habit." },
    { id: "reduce", icon: TrendingDown, title: "Reduce Spending", desc: "Identify unnecessary expenses and take control." },
    { id: "health", icon: ActivitySquare, title: "Improve Financial Health", desc: "Build healthier financial habits over time." },
  ];

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-offwhite text-ink overflow-hidden flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Navigation & Progress */}
      <header className="w-full max-w-4xl mx-auto flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between w-full">
          <Link href="/onboarding/accounts" className="text-ink/60 hover:text-ink transition-colors p-1">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink/40">
            Step 3 of 3
          </div>
          <div className="size-5" />
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-[66%] rounded-full" />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-2">
        <div className="w-full space-y-4 sm:space-y-6">
          
          <div className="text-center space-y-1">
            <h1 className="reveal-elem display text-2xl sm:text-3xl font-bold tracking-tight">
              Set your financial targets
            </h1>
            <p className="reveal-elem text-xs sm:text-sm text-ink/60">
              Set a few simple targets so Koshin can track your progress in SQLite and give actionable insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">
            
            {/* Budgets & Savings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="reveal-elem space-y-1">
                <label className="text-xs font-bold text-ink">Monthly Spending Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs">$</span>
                  <input 
                    type="text" 
                    placeholder="3,000"
                    value={spendingBudget}
                    onChange={(e) => setSpendingBudget(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-white py-2.5 pr-3 pl-7 text-xs text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
              
              <div className="reveal-elem space-y-1">
                <label className="text-xs font-bold text-ink">Monthly Savings Target</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs">$</span>
                  <input 
                    type="text" 
                    placeholder="1,000"
                    value={savingsTarget}
                    onChange={(e) => setSavingsTarget(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-white py-2.5 pr-3 pl-7 text-xs text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Primary Goal Selection */}
            <div className="space-y-2">
              <label className="reveal-elem block text-xs font-bold text-ink">What's your primary goal?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {goals.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`reveal-elem relative p-3 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? "border-purple bg-purple/5 shadow-md shadow-purple/10" 
                          : "border-hairline bg-white hover:border-purple/30 hover:bg-offwhite"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <goal.icon className={`size-4 ${isSelected ? "text-purple" : "text-ink/50"}`} />
                        <h3 className={`text-xs font-bold ${isSelected ? "text-ink" : "text-ink/80"}`}>{goal.title}</h3>
                      </div>
                      <p className="text-[11px] text-ink/60 leading-tight pl-7">{goal.desc}</p>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-purple">
                          <CheckCircle2 className="size-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Fund Conditional Input */}
            {selectedGoal === "emergency" && (
              <div className="reveal-elem p-4 rounded-xl bg-white border border-hairline space-y-1 transition-all duration-500 ease-out shadow-sm">
                <label className="text-xs font-bold text-ink">Emergency Reserve Target</label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs">$</span>
                  <input 
                    type="text" 
                    placeholder="10,000"
                    value={emergencyTarget}
                    onChange={(e) => setEmergencyTarget(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-offwhite py-2 pr-3 pl-7 text-xs text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="reveal-elem pt-2">
              <button
                type="submit"
                disabled={loading || !selectedGoal}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-ink/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {loading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
