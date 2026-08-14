"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Target, TrendingUp, ShieldCheck, CheckCircle2, DollarSign, Globe } from "lucide-react";

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "$",
  AUD: "$",
  AED: "AED ",
  SGD: "$",
};

export default function CreateProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { update } = useSession();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation
      gsap.fromTo(".progress-fill", 
        { width: "0%" }, 
        { width: "33%", duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
      
      // Staggered reveal for form elements
      gsap.fromTo(".reveal-elem", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_currency", selectedCurrency);
    }
  }, [selectedCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_currency", selectedCurrency);
      localStorage.setItem("user_monthly_income", monthlyIncome);
    }

    try {
      await fetch("/api/v1/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: CURRENCY_SYMBOLS[selectedCurrency] || "$" }),
      });
      await update({ currency: CURRENCY_SYMBOLS[selectedCurrency] || "$" });
    } catch (err) {
      console.error("Failed to update currency on server", err);
    }

    if (monthlyIncome.trim()) {
      try {
        const numericIncome = parseFloat(monthlyIncome.replace(/[^0-9\.]/g, ""));
        if (!isNaN(numericIncome) && numericIncome > 0) {
          await fetch("/api/v1/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: numericIncome,
              description: "Monthly Income / Salary",
              categoryName: "Income",
              type: "income",
              isRecurring: true,
            }),
          }).catch(() => null);
        }
      } catch (err) {
        console.error("Error saving income transaction to DB:", err);
      }
    }

    router.push("/onboarding/accounts"); 
  };

  const goals = [
    { id: "budgeting", icon: Target, title: "Smarter Budgeting", desc: "Track expenses and find leaks." },
    { id: "wealth", icon: TrendingUp, title: "Wealth Building", desc: "Grow assets and net worth." },
    { id: "debt", icon: ShieldCheck, title: "Debt Reduction", desc: "Pay off loans efficiently." },
  ];

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-offwhite text-ink overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navigation & Progress */}
      <header className="w-full max-w-4xl mx-auto flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between w-full">
          <Link href="/onboarding" className="text-ink/60 hover:text-ink transition-colors p-1">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink/40">
            Step 1 of 3
          </div>
          <div className="size-5" />
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-0 rounded-full" />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-2">
        <div className="w-full space-y-5 sm:space-y-6">
          
          <div className="text-center space-y-1.5">
            <h1 className="reveal-elem display text-2xl sm:text-3xl font-bold tracking-tight">
              Create your financial profile
            </h1>
            <p className="reveal-elem text-xs sm:text-sm text-ink/60">
              Tell us a bit about your current situation so we can tailor Koshin&apos;s AI to your specific needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            {/* Primary Goal Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label className="reveal-elem block text-xs font-bold text-ink">What is your primary financial focus?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {goals.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`reveal-elem relative p-4 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected 
                          ? "border-purple bg-purple/5 shadow-md shadow-purple/10" 
                          : "border-hairline bg-white hover:border-purple/30 hover:bg-offwhite"
                      }`}
                    >
                      <goal.icon className={`size-5 mb-2 ${isSelected ? "text-purple" : "text-ink/50"}`} />
                      <h3 className={`text-xs font-bold mb-0.5 ${isSelected ? "text-ink" : "text-ink/80"}`}>{goal.title}</h3>
                      <p className="text-[11px] text-ink/50 leading-tight">{goal.desc}</p>
                      
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

            {/* Income & Currency Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="reveal-elem space-y-1">
                <label className="text-xs font-bold text-ink/80">Estimated Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple font-bold text-xs">
                    {CURRENCY_SYMBOLS[selectedCurrency] || "₹"}
                  </span>
                  <input 
                    type="number" 
                    placeholder="75,000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-white py-2.5 pr-3 pl-8 text-xs font-semibold text-ink placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
              
              <div className="reveal-elem space-y-1">
                <label className="text-xs font-bold text-ink/80 flex items-center justify-between">
                  <span>Base Currency</span>
                  <span className="text-[10px] font-semibold text-purple">Default: INR</span>
                </label>
                <div className="relative">
                  <select 
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-white py-2.5 px-3.5 text-xs font-bold text-ink focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors cursor-pointer"
                  >
                    <option value="INR">₹ INR - Indian Rupee</option>
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="EUR">€ EUR - Euro</option>
                    <option value="GBP">£ GBP - British Pound</option>
                    <option value="CAD">$ CAD - Canadian Dollar</option>
                    <option value="AUD">$ AUD - Australian Dollar</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SGD">$ SGD - Singapore Dollar</option>
                  </select>
                </div>
              </div>
            </div>

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
                    Continue to Accounts <ArrowRight className="size-4" />
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
