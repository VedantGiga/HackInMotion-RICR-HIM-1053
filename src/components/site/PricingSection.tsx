"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".pricing-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "For individuals beginning their financial journey.",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: <ShieldCheck className="size-5 text-emerald-500" />,
      features: [
        "Up to 2 Bank Connections",
        "Basic Auto-Categorization",
        "Monthly Health Score",
        "Community Support",
      ],
      buttonText: "Start for free",
      isPopular: false,
      color: "emerald",
    },
    {
      name: "Pro",
      description: "For professionals wanting deep AI insights and control.",
      monthlyPrice: 12,
      annualPrice: 9,
      icon: <Zap className="size-5 text-purple" />,
      features: [
        "Unlimited Bank Connections",
        "Advanced AI NLP Engine",
        "Silent Subscription Tracker",
        "Priority Email Support",
        "Custom Budget Goals",
      ],
      buttonText: "Get Pro",
      isPopular: true,
      color: "purple",
    },
    {
      name: "Elite",
      description: "For power users who need complete financial dominance.",
      monthlyPrice: 39,
      annualPrice: 29,
      icon: <Sparkles className="size-5 text-amber-500" />,
      features: [
        "Everything in Pro",
        "Dedicated Financial Advisor AI",
        "Tax Deductible Exporting",
        "Family Workspace (up to 4)",
        "24/7 Phone Support",
      ],
      buttonText: "Go Elite",
      isPopular: false,
      color: "amber",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-offwhite relative overflow-hidden" id="pricing">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="shell relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 pricing-heading">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="size-3.5" />
            Simple Pricing
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl font-bold text-ink mb-6 tracking-tight">
            Invest in your financial future
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the plan that best fits your needs. Our AI-driven insights easily pay for themselves by finding hidden subscriptions and optimizing your budget.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-semibold transition-colors ${!isAnnual ? "text-ink" : "text-muted-foreground"}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-ink/10 flex items-center px-1 transition-colors hover:bg-ink/20"
            >
              <motion.div 
                className="w-6 h-6 rounded-full bg-white shadow-sm border border-hairline"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 transition-colors ${isAnnual ? "text-ink" : "text-muted-foreground"}`}>
              Annually
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Save 25%</span>
            </span>
          </div>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -8 }}
              className={`pricing-card relative rounded-[2rem] p-8 md:p-10 transition-shadow duration-300 ${
                plan.isPopular 
                  ? "bg-navy text-white shadow-2xl shadow-purple/20 border border-white/10 md:-translate-y-4" 
                  : "bg-white text-ink border border-hairline shadow-lg shadow-black/5"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${plan.isPopular ? "bg-white/10" : "bg-offwhite"}`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              
              <p className={`text-sm mb-6 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className={`text-sm font-medium ${plan.isPopular ? "text-white/60" : "text-muted-foreground"}`}>
                  /mo
                </span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium">
                    <Check className={`size-5 shrink-0 ${plan.isPopular ? "text-purple-300" : "text-purple"}`} />
                    <span className={plan.isPopular ? "text-white/90" : "text-ink/80"}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/signup"
                className={`block w-full py-4 rounded-xl text-sm font-bold text-center transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-white text-navy hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    : "bg-ink text-white hover:bg-ink/90 hover:shadow-lg"
                }`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
