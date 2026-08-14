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
  Target,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("This Month");

  const [isLoading, setIsLoading] = useState(true);
  const [spendingData, setSpendingData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [spendingRes, healthRes] = await Promise.all([
        fetch("/api/v1/analysis/spending").catch(() => null),
        fetch("/api/v1/analysis/health").catch(() => null),
      ]);

      if (spendingRes && spendingRes.ok) {
        const json = await spendingRes.json();
        if (json.data) setSpendingData(json.data);
      }

      if (healthRes && healthRes.ok) {
        const json = await healthRes.json();
        if (json.data) setHealthData(json.data);
      }
    } catch (err) {
      console.error("Error loading analytics data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".analytics-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
      gsap.fromTo(".progress-bar-fill",
        { width: "0%" },
        { width: (index, target) => target.dataset.width, duration: 1.5, ease: "power3.out", delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, spendingData]);

  const totalSpent = spendingData?.totalSpentThisMonth ?? 0;
  const totalIncome = spendingData?.totalIncomeThisMonth ?? 0;
  const netSavings = spendingData?.netSavings ?? (totalIncome - totalSpent);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  const healthScore = healthData?.score ?? 100;
  const primaryInsight = healthData?.insights?.[0] || "Upload a bank statement to generate AI financial analysis.";

  const categoryBreakdown: Array<{ name: string; amount: number; percentage: number; color: string }> = [];
  const rawBreakdown = spendingData?.breakdownThisMonth || [];
  const colors = ["bg-purple", "bg-cyan", "bg-emerald-500", "bg-pinkish", "bg-amber-400", "bg-ink/40"];

  if (Array.isArray(rawBreakdown)) {
    rawBreakdown.forEach((item: any, i: number) => {
      const amt = item.amount || 0;
      const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
      categoryBreakdown.push({
        name: item.name || "General",
        amount: amt,
        percentage: pct,
        color: colors[i % colors.length]
      });
    });
  }

  // Calculate Dashoffset for SVG circle (perimeter = 2 * PI * r = 251.2)
  const circleOffset = 251.2 - (251.2 * Math.min(savingsRate, 100)) / 100;

  return (
    <div ref={containerRef} className="min-h-screen bg-offwhite text-ink flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-20 border-b border-hairline bg-white/50 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-sm font-bold text-purple hover:text-purple/80 transition-colors flex items-center gap-2 cursor-pointer"
        >
          ← Back to Dashboard Overview
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-hairline rounded-lg cursor-pointer hover:border-ink/20 transition-colors shadow-xs">
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
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Live Statement Analytics</h1>
            <p className="text-sm text-ink/60">Grounded strictly in SQLite database transaction logs.</p>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-hairline rounded-lg text-sm font-bold shadow-xs hover:border-ink/20 transition-colors w-fit cursor-pointer"
          >
            <Download className="size-4 text-purple" /> Export Report
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
            <Loader2 className="size-5 animate-spin text-purple" /> Loading live database analytics...
          </div>
        ) : (
          <>
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="analytics-card p-6 rounded-3xl bg-white border border-hairline shadow-sm relative overflow-hidden group">
                <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Total Outflow</h3>
                <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 relative z-10">
                  <ArrowDownRight className="size-3" />
                  <span>Real DB Aggregation</span>
                </div>
              </div>
              
              <div className="analytics-card p-6 rounded-3xl bg-white border border-hairline shadow-sm relative overflow-hidden group">
                <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Savings Rate</h3>
                <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10 text-purple">{savingsRate}%</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-purple relative z-10">
                  <ArrowUpRight className="size-3" />
                  <span>Net Savings: ${netSavings.toFixed(2)}</span>
                </div>
              </div>

              <div className="analytics-card p-6 rounded-3xl bg-gradient-to-br from-ink to-navy text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="size-4 text-cyan" /> Health Audit (Score: {healthScore}/100)
                  </h3>
                  <p className="text-sm leading-relaxed text-white/90">
                    {primaryInsight}
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 text-xs font-bold text-cyan hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  View Co-Pilot Suggestions <ArrowUpRight className="size-3" />
                </button>
              </div>
            </div>

            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Categories List */}
              <div className="analytics-card p-8 rounded-3xl bg-white border border-hairline shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Category Breakdown</h3>
                  <PieChartIcon className="size-5 text-purple" />
                </div>
                
                {categoryBreakdown.length === 0 ? (
                  <div className="p-8 text-center bg-offwhite/50 border border-hairline rounded-2xl text-xs text-muted-foreground">
                    No expense categories recorded yet. Upload a statement on the dashboard to calculate allocation.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {categoryBreakdown.map((cat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-ink/80 flex items-center gap-2">
                            <span className={`size-3 rounded-full ${cat.color}`} />
                            {cat.name}
                          </span>
                          <span className="font-bold text-ink">${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({cat.percentage}%)</span>
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
                )}
              </div>

              {/* Goal / Savings Rate Gauge */}
              <div className="analytics-card p-8 rounded-3xl bg-white border border-hairline shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Monthly Savings Rate</h3>
                  <Target className="size-5 text-cyan" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10">
                   <div className="relative size-48 flex items-center justify-center">
                      <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-offwhite" />
                        <circle 
                          cx="50" cy="50" r="40" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="none" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={circleOffset}
                          strokeLinecap="round"
                          className="text-cyan drop-shadow-md transition-all duration-1000" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-display font-bold">{savingsRate}%</span>
                        <span className="text-xs font-bold text-ink/50 uppercase tracking-wider mt-1">Savings Rate</span>
                      </div>
                   </div>
                   
                   <div className="text-center max-w-xs">
                     <p className="text-sm text-ink/60">
                       {savingsRate >= 20 
                         ? "Great job! You are saving over 20% of your total income." 
                         : "Try cutting non-essential spending to reach a 20%+ monthly savings rate."}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
