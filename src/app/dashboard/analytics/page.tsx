"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar,
  Zap,
  Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("This Month");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger cards
      gsap.fromTo(".analytics-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
      
      // Animate progress bars
      gsap.fromTo(".progress-bar-fill",
        { width: "0%" },
        { width: (index, target) => target.dataset.width, duration: 1.5, ease: "power3.out", delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [timeframe]); // Re-run when timeframe changes

  const categories = [
    { name: "Housing", amount: 2000, color: "bg-purple", percentage: 45 },
    { name: "Food & Dining", amount: 850, color: "bg-cyan", percentage: 20 },
    { name: "Transportation", amount: 400, color: "bg-ink", percentage: 10 },
    { name: "Entertainment", amount: 350, color: "bg-rose-400", percentage: 8 },
    { name: "Utilities", amount: 300, color: "bg-amber-400", percentage: 7 },
    { name: "Other", amount: 500, color: "bg-ink/20", percentage: 10 },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-offwhite text-ink flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-20 border-b border-hairline bg-white/50 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-sm font-bold text-ink/60 hover:text-ink transition-colors flex items-center gap-2"
        >
          ← Back to Overview
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-offwhite border border-hairline rounded-lg cursor-pointer hover:border-ink/20 transition-colors">
          <Calendar className="size-4 text-ink/60" />
          <select 
            className="bg-transparent border-none outline-none text-sm font-semibold text-ink cursor-pointer appearance-none pr-4"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Analytics</h1>
            <p className="text-sm text-ink/60">Deep dive into your spending habits and financial trends.</p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-hairline rounded-lg text-sm font-bold shadow-sm hover:border-ink/20 transition-colors w-fit">
            <Download className="size-4" /> Export Report
          </button>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="analytics-card p-6 rounded-3xl bg-white border border-hairline shadow-sm relative overflow-hidden group">
            <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Total Outflow</h3>
            <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10">$4,400.00</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 relative z-10">
              <ArrowDownRight className="size-3" />
              <span>-12.5%</span>
              <span className="text-ink/40 font-normal ml-1">vs average</span>
            </div>
          </div>
          
          <div className="analytics-card p-6 rounded-3xl bg-white border border-hairline shadow-sm relative overflow-hidden group">
            <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Savings Rate</h3>
            <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10 text-purple">24%</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 relative z-10">
              <ArrowUpRight className="size-3" />
              <span>+2.1%</span>
              <span className="text-ink/40 font-normal ml-1">vs average</span>
            </div>
          </div>

          <div className="analytics-card p-6 rounded-3xl bg-gradient-to-br from-ink to-navy text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Zap className="size-4 text-cyan" /> AI Insight
              </h3>
              <p className="text-sm leading-relaxed text-white/90">
                You spent 30% less on Dining Out this month. Keeping this up will hit your yearly savings goal 2 months early.
              </p>
            </div>
            <button className="mt-4 text-xs font-bold text-cyan hover:text-white transition-colors text-left flex items-center gap-1">
              View AI Suggestions <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Categories List */}
          <div className="analytics-card p-8 rounded-3xl bg-white border border-hairline shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Category Breakdown</h3>
              <PieChartIcon className="size-5 text-ink/40" />
            </div>
            
            <div className="space-y-6">
              {categories.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-ink/80 flex items-center gap-2">
                      <span className={`size-3 rounded-full ${cat.color}`} />
                      {cat.name}
                    </span>
                    <span className="font-bold text-ink">${cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-offwhite rounded-full overflow-hidden">
                    <div 
                      className={`progress-bar-fill h-full ${cat.color} rounded-full`} 
                      data-width={`${cat.percentage}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Tracking (Visual placeholder for another widget) */}
          <div className="analytics-card p-8 rounded-3xl bg-white border border-hairline shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Monthly Goals</h3>
              <Target className="size-5 text-ink/40" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10">
               {/* Custom circular progress indicator using SVG */}
               <div className="relative size-48 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-offwhite" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="62.8" /* 75% complete */
                      strokeLinecap="round"
                      className="text-cyan drop-shadow-md" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-display font-bold">75%</span>
                    <span className="text-xs font-bold text-ink/50 uppercase tracking-wider mt-1">On Track</span>
                  </div>
               </div>
               
               <div className="text-center max-w-xs">
                 <p className="text-sm text-ink/60">
                   You are comfortably within your budget limits for the month. Great job sticking to the plan!
                 </p>
               </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
