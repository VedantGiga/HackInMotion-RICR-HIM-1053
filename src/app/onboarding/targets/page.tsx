"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, PiggyBank, TrendingDown, ActivitySquare } from "lucide-react";

export default function TargetsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation (from 66% to 100%)
      gsap.fromTo(".progress-fill", 
        { width: "66%" }, 
        { width: "100%", duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
      
      // Staggered reveal for form elements
      gsap.fromTo(".reveal-elem", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API transition to dashboard
    setTimeout(() => {
      router.push("/dashboard"); 
    }, 1200);
  };

  const goals = [
    { id: "emergency", icon: ShieldAlert, title: "Build an Emergency Fund", desc: "Create a safety net for unexpected expenses." },
    { id: "save", icon: PiggyBank, title: "Save More", desc: "Build a stronger and more consistent saving habit." },
    { id: "reduce", icon: TrendingDown, title: "Reduce Spending", desc: "Identify unnecessary expenses and take control." },
    { id: "health", icon: ActivitySquare, title: "Improve Financial Health", desc: "Build healthier financial habits over time." },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-offwhite text-ink flex flex-col">
      {/* Top Navigation & Progress */}
      <header className="w-full p-6 lg:px-12 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <Link href="/onboarding/accounts" className="text-ink/60 hover:text-ink transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">
            Step 3 of 3
          </div>
          <div className="size-5" /> {/* Spacer to balance flex-between */}
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-[66%] rounded-full" />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto mb-12">
        <div className="w-full space-y-10">
          
          <div className="text-center space-y-3">
            <h1 className="reveal-elem display text-3xl md:text-4xl font-bold tracking-tight">
              Set your financial targets
            </h1>
            <p className="reveal-elem text-sm md:text-base text-ink/60">
              Set a few simple targets so Koshin can track your progress and give you more actionable financial insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 w-full">
            
            {/* Budgets & Savings Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="reveal-elem space-y-1.5">
                <label className="text-sm font-bold text-ink">Monthly Spending Budget</label>
                <p className="text-xs text-ink/60 mb-2">The maximum you want to spend each month.</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-bold">₹</span>
                  <input 
                    type="text" 
                    placeholder="30,000"
                    className="w-full rounded-xl border border-hairline bg-white py-3 pr-4 pl-8 text-sm text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
              
              <div className="reveal-elem space-y-1.5">
                <label className="text-sm font-bold text-ink">Monthly Savings Target</label>
                <p className="text-xs text-ink/60 mb-2">How much you want to save each month.</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-bold">₹</span>
                  <input 
                    type="text" 
                    placeholder="10,000"
                    className="w-full rounded-xl border border-hairline bg-white py-3 pr-4 pl-8 text-sm text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Primary Goal Selection */}
            <div className="space-y-4">
              <label className="reveal-elem block text-lg font-bold text-ink">What's your primary goal?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`reveal-elem relative p-5 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected 
                          ? "border-purple bg-purple/5 shadow-md shadow-purple/10" 
                          : "border-hairline bg-white hover:border-purple/30 hover:bg-offwhite"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <goal.icon className={`size-5 ${isSelected ? "text-purple" : "text-ink/50"}`} />
                        <h3 className={`text-sm font-bold ${isSelected ? "text-ink" : "text-ink/80"}`}>{goal.title}</h3>
                      </div>
                      <p className="text-xs text-ink/60 leading-relaxed pl-9">{goal.desc}</p>
                      
                      {isSelected && (
                        <div className="absolute top-5 right-5 text-purple">
                          <CheckCircle2 className="size-5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Fund Conditional Input */}
            {selectedGoal === "emergency" && (
              <div className="reveal-elem p-6 rounded-2xl bg-white border border-hairline space-y-1.5 transition-all duration-500 ease-out shadow-sm">
                <label className="text-sm font-bold text-ink">Emergency Fund Target</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-bold">₹</span>
                  <input 
                    type="text" 
                    placeholder="1,00,000"
                    className="w-full rounded-xl border border-hairline bg-offwhite py-3 pr-4 pl-8 text-sm text-ink font-semibold placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="reveal-elem pt-6">
              <button
                type="submit"
                disabled={loading || !selectedGoal}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-ink/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
