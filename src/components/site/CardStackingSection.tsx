"use client";

import { Sparkles, PieChart, LineChart, Wallet, MessageSquareText } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "NLP Auto-Categorization Engine",
    description: "Koshin automatically cleans messy raw bank data (like 'TST* SBUX 4921') into clean categories — Groceries, Dining, Travel, Subscriptions, Utilities — with 99.4% accuracy.",
    icon: <PieChart className="size-6 text-white" />,
    color: "bg-navy",
    textColor: "text-white",
    metrics: "99.4% Category Precision",
  },
  {
    id: 2,
    title: "Dynamic Financial Health Score",
    description: "A real-time 0–100 financial health index calculated from your emergency savings buffer, debt ratio, monthly spending velocity, and subscription load.",
    icon: <LineChart className="size-6 text-ink" />,
    color: "bg-white border border-hairline",
    textColor: "text-ink",
    metrics: "Dynamic 0-100 Health Index",
  },
  {
    id: 3,
    title: "Silent Subscription & Bill Detector",
    description: "Instantly detect sneaky recurring charges, unexpected price hikes, and forgotten streaming trials before they drain your account balance.",
    icon: <Wallet className="size-6 text-white" />,
    color: "bg-purple",
    textColor: "text-white",
    metrics: "$340 Avg. Annual Savings",
  },
  {
    id: 4,
    title: "Conversational AI Financial Advisor",
    description: "Ask natural questions like 'How much did I spend on dining out this month?' or 'Can I afford a $500 weekend trip?' and get instant, plain-English answers backed by your live data.",
    icon: <MessageSquareText className="size-6 text-white" />,
    color: "bg-ink",
    textColor: "text-white",
    metrics: "Instant Conversational AI",
  }
];

export function CardStackingSection() {
  return (
    <section className="relative bg-white py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
        
        {/* Left side sticky header */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-3.5 py-1.5 text-xs font-semibold text-purple">
            <Sparkles className="size-3.5" /> Koshin Core Capabilities
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Intelligence at every level.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Because you can&apos;t fix what you can&apos;t see — experience financial tools designed for precision, automation, and total clarity.
          </p>
        </div>

        {/* Right side stacking cards */}
        <div className="lg:w-2/3 space-y-6 pb-24 lg:pb-32">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`sticky rounded-[2rem] p-8 sm:p-12 shadow-xl flex flex-col justify-between ${card.color} ${card.textColor}`}
              style={{
                top: `calc(100px + ${index * 20}px)`,
                minHeight: "380px"
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${card.color === 'bg-white border border-hairline' ? 'bg-offwhite' : 'bg-white/10 backdrop-blur-md'}`}>
                  {card.icon}
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold ${card.color === 'bg-white border border-hairline' ? 'bg-ink/5 text-ink' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                  {card.metrics}
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <h3 className="display text-2xl sm:text-3xl font-bold tracking-tight">
                  {card.title}
                </h3>
                <p className={`text-base sm:text-lg leading-relaxed ${card.color === 'bg-white border border-hairline' ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
