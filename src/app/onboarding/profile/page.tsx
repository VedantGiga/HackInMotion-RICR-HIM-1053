"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Target, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CreateProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API transition to next step
    setTimeout(() => {
      router.push("/onboarding/accounts"); 
    }, 1200);
  };

  const goals = [
    { id: "budgeting", icon: Target, title: "Smarter Budgeting", desc: "Track expenses and find leaks." },
    { id: "wealth", icon: TrendingUp, title: "Wealth Building", desc: "Grow assets and net worth." },
    { id: "debt", icon: ShieldCheck, title: "Debt Reduction", desc: "Pay off loans efficiently." },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-offwhite text-ink flex flex-col">
      {/* Top Navigation & Progress */}
      <header className="w-full p-6 lg:px-12 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <Link href="/onboarding" className="text-ink/60 hover:text-ink transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">
            Step 1 of 3
          </div>
          <div className="size-5" /> {/* Spacer to balance flex-between */}
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-0 rounded-full" />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
        <div className="w-full space-y-10">
          
          <div className="text-center space-y-3">
            <h1 className="reveal-elem display text-3xl md:text-4xl font-bold tracking-tight">
              Create your financial profile
            </h1>
            <p className="reveal-elem text-sm md:text-base text-ink/60">
              Tell us a bit about your current situation so we can tailor Koshin's AI to your specific needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            {/* Primary Goal Selection */}
            <div className="space-y-4">
              <label className="reveal-elem block text-sm font-bold text-ink">What is your primary financial focus?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <goal.icon className={`size-6 mb-3 ${isSelected ? "text-purple" : "text-ink/50"}`} />
                      <h3 className={`text-sm font-bold mb-1 ${isSelected ? "text-ink" : "text-ink/80"}`}>{goal.title}</h3>
                      <p className="text-xs text-ink/50 leading-relaxed">{goal.desc}</p>
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-purple">
                          <CheckCircle2 className="size-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Income & Currency Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="reveal-elem space-y-1.5">
                <label className="text-xs font-bold text-ink/80">Estimated Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-mono">$</span>
                  <input 
                    type="number" 
                    placeholder="5,000"
                    className="w-full rounded-xl border border-hairline bg-white py-3 pr-4 pl-8 text-sm text-ink placeholder-ink/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors"
                  />
                </div>
              </div>
              
              <div className="reveal-elem space-y-1.5">
                <label className="text-xs font-bold text-ink/80">Base Currency</label>
                <select className="w-full rounded-xl border border-hairline bg-white py-3 px-4 text-sm text-ink focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple transition-colors appearance-none">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>

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
