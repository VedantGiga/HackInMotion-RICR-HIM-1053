"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  PieChart,
  Activity,
  Bell,
  Search,
  Menu
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sidebar animation
      gsap.fromTo(".sidebar-item", 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
      
      // Main content stagger
      gsap.fromTo(".dashboard-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const transactions = [
    { id: 1, name: "Apple Store", category: "Electronics", amount: -1299.00, date: "Today, 2:45 PM", icon: CreditCard },
    { id: 2, name: "Whole Foods", category: "Groceries", amount: -142.50, date: "Yesterday", icon: PieChart },
    { id: 3, name: "Salary Deposit", category: "Income", amount: 4200.00, date: "Aug 10", icon: Wallet, positive: true },
    { id: 4, name: "Uber Ride", category: "Transport", amount: -24.90, date: "Aug 9", icon: Activity },
  ];

  return (
<<<<<<< HEAD
    <main className="bg-background min-h-screen text-ink">
      <KoshinDashboard />
    </main>
=======
    <div ref={containerRef} className="min-h-screen bg-offwhite text-ink flex font-sans">
      
      {/* Minimal Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-hairline bg-white/50 backdrop-blur-md p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="size-8 rounded-lg bg-gradient-to-tr from-purple to-cyan" />
          <span className="font-display font-bold text-xl tracking-tight">Koshin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Overview", icon: Activity, active: true },
            { name: "Transactions", icon: CreditCard },
            { name: "Analytics", icon: PieChart },
            { name: "Goals", icon: TrendingUp },
          ].map((item, i) => (
            <Link 
              key={i} 
              href="#" 
              className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? "bg-ink text-white shadow-md" 
                  : "text-ink/60 hover:bg-hairline/50 hover:text-ink"
              }`}
            >
              <item.icon className="size-5" />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-item mt-auto p-4 rounded-xl bg-purple/5 border border-purple/10">
          <p className="text-xs font-bold text-purple mb-1">PRO Plan Active</p>
          <p className="text-[10px] text-ink/50">All AI features enabled</p>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 border-b border-hairline bg-white/50 backdrop-blur-md px-6 md:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-ink hover:text-purple transition-colors">
              <Menu className="size-6" />
            </button>
            <div className="size-6 rounded-md bg-gradient-to-tr from-purple to-cyan" />
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-offwhite border border-hairline rounded-full w-96 focus-within:border-purple/50 focus-within:ring-1 focus-within:ring-purple/20 transition-all">
            <Search className="size-4 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search transactions, categories..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-ink/30"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-ink/60 hover:text-ink transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-cyan rounded-full border-2 border-white" />
            </button>
            <div className="size-10 rounded-full bg-gradient-to-tr from-purple/20 to-cyan/20 border border-hairline overflow-hidden flex items-center justify-center">
              <span className="text-xs font-bold text-purple">JS</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <header className="dashboard-card flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">Good morning, John.</h1>
                <p className="text-sm text-ink/60">Here is your financial overview for August.</p>
              </div>
              <button className="px-5 py-2.5 bg-ink text-white text-sm font-bold rounded-full hover:bg-ink/90 transition-colors shadow-lg">
                + Add Transaction
              </button>
            </header>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Balance */}
              <div className="dashboard-card p-6 rounded-3xl bg-white border border-hairline shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wallet className="size-24 text-ink" />
                </div>
                <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Total Balance</h3>
                <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10">$12,450.00</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 relative z-10">
                  <ArrowUpRight className="size-3" />
                  <span>+2.4%</span>
                  <span className="text-ink/40 font-normal ml-1">vs last month</span>
                </div>
              </div>

              {/* Monthly Spending */}
              <div className="dashboard-card p-6 rounded-3xl bg-white border border-hairline shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="size-24 text-purple" />
                </div>
                <h3 className="text-sm font-bold text-ink/50 mb-4 uppercase tracking-wider relative z-10">Monthly Spend</h3>
                <div className="text-4xl font-display font-bold tracking-tight mb-2 relative z-10">$3,210.40</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-500 relative z-10">
                  <ArrowDownRight className="size-3" />
                  <span>-1.2%</span>
                  <span className="text-ink/40 font-normal ml-1">vs last month</span>
                </div>
              </div>

              {/* Health Score */}
              <div className="dashboard-card p-6 rounded-3xl bg-gradient-to-br from-ink to-navy text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="size-24 text-cyan" />
                </div>
                <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider relative z-10">AI Health Score</h3>
                <div className="flex items-end gap-2 mb-2 relative z-10">
                  <div className="text-5xl font-display font-bold text-cyan tracking-tight">85</div>
                  <div className="text-lg font-bold text-white/80 pb-1">/ 100</div>
                </div>
                <div className="text-xs text-white/70 relative z-10">
                  Your spending habits are <span className="font-bold text-cyan">Excellent</span>. Keep it up!
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Transactions */}
              <div className="dashboard-card lg:col-span-2 p-6 rounded-3xl bg-white border border-hairline shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Recent Transactions</h3>
                  <button className="text-sm font-bold text-purple hover:underline">View All</button>
                </div>
                <div className="space-y-1">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-offwhite transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-xl flex items-center justify-center transition-colors ${
                          tx.positive ? "bg-emerald-500/10 text-emerald-600" : "bg-ink/5 text-ink/60 group-hover:bg-purple/10 group-hover:text-purple"
                        }`}>
                          <tx.icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-ink">{tx.name}</p>
                          <p className="text-xs text-ink/50">{tx.category} • {tx.date}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${tx.positive ? "text-emerald-600" : "text-ink"}`}>
                        {tx.positive ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spending Breakdown */}
              <div className="dashboard-card p-6 rounded-3xl bg-white border border-hairline shadow-sm">
                <h3 className="text-lg font-bold mb-6">Top Categories</h3>
                <div className="space-y-6">
                  {[
                    { name: "Housing", amount: "$2,000", percent: 65, color: "bg-purple" },
                    { name: "Food & Dining", amount: "$650", percent: 25, color: "bg-cyan" },
                    { name: "Transport", amount: "$150", percent: 10, color: "bg-ink" },
                  ].map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-ink/80">{cat.name}</span>
                        <span className="text-ink">{cat.amount}</span>
                      </div>
                      <div className="w-full h-2 bg-offwhite rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cat.color} rounded-full`} 
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

    </div>
>>>>>>> 89fa7557461b29b6ade62b3f294aa0f371ed660e
  );
}
