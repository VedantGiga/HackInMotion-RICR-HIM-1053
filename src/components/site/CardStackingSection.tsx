"use client";

import { motion } from "motion/react";
import { Sparkles, PieChart, Shield, LineChart, Wallet } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "AI-Powered Categorization",
    description: "Our proprietary AI engine automatically categorizes every transaction with 99.9% accuracy, saving you hours of manual spreadsheet work.",
    icon: <PieChart className="size-6 text-white" />,
    color: "bg-navy",
    textColor: "text-white",
    metrics: "+4.2hrs saved weekly",
  },
  {
    id: 2,
    title: "Predictive Budgeting",
    description: "Stop looking at the past. Koshin predicts your future cash flow based on historical patterns, upcoming subscriptions, and irregular bills.",
    icon: <LineChart className="size-6 text-ink" />,
    color: "bg-white border border-hairline",
    textColor: "text-ink",
    metrics: "94% prediction accuracy",
  },
  {
    id: 3,
    title: "Subscription Intelligence",
    description: "Instantly identify forgotten subscriptions, upcoming renewals, and hidden fees. Cancel unwanted services directly from your dashboard.",
    icon: <Wallet className="size-6 text-white" />,
    color: "bg-purple",
    textColor: "text-white",
    metrics: "$340/yr average savings",
  },
  {
    id: 4,
    title: "Bank-Grade Security",
    description: "Your financial data is protected by AES-256 encryption. We never sell your data, and you maintain complete control over your connections.",
    icon: <Shield className="size-6 text-white" />,
    color: "bg-ink",
    textColor: "text-white",
    metrics: "SOC2 Type II Certified",
  }
];

export function CardStackingSection() {
  return (
    <section className="relative bg-offwhite py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
        
        {/* Left side sticky header */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">
            <Sparkles className="size-3.5" /> Premium Features
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Intelligence at every level.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the future of personal finance with tools designed for precision, automation, and total clarity.
          </p>
        </div>

        {/* Right side stacking cards */}
        <div className="lg:w-2/3 space-y-6 pb-24 lg:pb-32">
          {cards.map((card, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={card.id}
              className={`sticky rounded-[2rem] p-8 sm:p-12 shadow-xl flex flex-col justify-between ${card.color} ${card.textColor}`}
              style={{
                top: `calc(100px + ${index * 20}px)`,
                minHeight: "400px"
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
                <h3 className="display text-3xl font-bold tracking-tight">
                  {card.title}
                </h3>
                <p className={`text-lg leading-relaxed ${card.color === 'bg-white border border-hairline' ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
