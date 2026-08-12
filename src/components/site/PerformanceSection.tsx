"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Sparkles,
  PieChart,
  Activity,
  BellRing,
  MessageSquareText,
  Sliders,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import overviewCubes from "@/assets/overview-cubes.png";
import heroTorus from "@/assets/hero-torus.png";
import capabilitiesBlock from "@/assets/capabilities-block.png";

export function PerformanceSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-bento-card]");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12 }
          );
          io.disconnect();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cubesSrc = typeof overviewCubes === "string" ? overviewCubes : overviewCubes.src;
  const torusSrc = typeof heroTorus === "string" ? heroTorus : heroTorus.src;
  const blockSrc = typeof capabilitiesBlock === "string" ? capabilitiesBlock : capabilitiesBlock.src;

  return (
    <section
      id="problem"
      ref={root}
      className="bg-white py-24 md:py-32 lg:py-40 relative overflow-hidden"
    >
      <div className="shell max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-3.5 py-1 text-xs font-semibold text-purple">
            <Sparkles className="size-3.5" /> Problem & Solution
          </div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-[1.15]">
            Cryptic Statements. <br />
            <span className="text-purple">Honest Clarity.</span>
          </h2>
          <p className="text-base sm:text-lg leading-[1.6] text-muted-foreground font-normal">
            Manual budgeting fails. Koshin automates transaction intelligence.
          </p>
        </div>

        {/* ULTRA-PREMIUM BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* BENTO CARD 1: Large 2-Col Hero Auto-Categorization Card */}
          <div
            data-bento-card
            className="md:col-span-8 rounded-3xl bg-gradient-to-br from-ink via-navy to-black text-white p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl border border-white/10 group"
          >
            {/* 3D Overview Cubes Visual in BG */}
            <img
              src={cubesSrc}
              alt="3D Cubes Visual"
              className="absolute -right-12 -bottom-12 w-80 sm:w-96 h-auto object-contain opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="absolute top-0 right-1/3 size-64 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center">
                <PieChart className="size-6 text-lime" />
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-lime/20 border border-lime/40 text-lime text-xs font-bold uppercase tracking-wider">
                99.4% Accuracy
              </span>
            </div>

            <div className="relative z-10 space-y-4 mt-12 max-w-lg">
              <h3 className="display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Zero Manual Tagging & NLP Categorization
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-normal leading-[1.6]">
                Koshin parses cryptic transaction strings (like &quot;TST* SBUX 4921&quot;) into clean, accurate categories — Food, Rent, Subscriptions, and Travel.
              </p>
              
              {/* Category Pill Visuals */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-white backdrop-blur-sm">
                  <CheckCircle2 className="size-3.5 text-lime" /> Groceries $420
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-white backdrop-blur-sm">
                  <CheckCircle2 className="size-3.5 text-lime" /> Subscriptions $89
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-white backdrop-blur-sm">
                  <CheckCircle2 className="size-3.5 text-lime" /> Dining $310
                </span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: Dynamic Health Score (Mint/Lime Accent) */}
          <div
            data-bento-card
            className="md:col-span-4 rounded-3xl bg-lime/20 border border-lime/40 text-ink p-8 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-lg group hover:border-lime transition-colors"
          >
            <div className="absolute -bottom-10 -right-10 size-48 bg-lime/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-white/80 border border-lime/40 flex items-center justify-center shadow-sm">
                <Activity className="size-6 text-emerald-700" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                0-100 Score
              </span>
            </div>

            <div className="my-6 space-y-2">
              <div className="display text-5xl font-extrabold text-ink tracking-tight flex items-baseline gap-2">
                <span>94</span>
                <span className="text-lg font-semibold text-emerald-700">/100</span>
              </div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-widest">
                Financial Health Index
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="display text-xl font-bold tracking-tight text-ink">
                Financial Health Score
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-[1.6]">
                Objective score based on savings buffer, debt ratio, and monthly spending velocity.
              </p>
            </div>
          </div>

          {/* BENTO CARD 3: Silent Subscription & Bill Detector (Purple Card) */}
          <div
            data-bento-card
            className="md:col-span-5 rounded-3xl bg-purple text-white p-8 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-xl group border border-purple-light/20"
          >
            {/* 3D Torus Background Graphic */}
            <img
              src={torusSrc}
              alt="3D Torus"
              className="absolute -right-16 -top-12 w-64 h-auto object-contain opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />

            <div className="relative z-10 flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <BellRing className="size-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                Alert Engine
              </span>
            </div>

            <div className="relative z-10 space-y-3 mt-8">
              <h3 className="display text-2xl font-bold tracking-tight text-white">
                Subscription & Trial Detector
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-[1.6]">
                Flags recurring subscriptions, forgotten free trials, and silent monthly price hikes before they drain your account.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-white/90">
                <TrendingUp className="size-4 text-lime" />
                <span>Average savings: $340/year</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: Plain-Language AI Insights (Clean White Glass Card) */}
          <div
            data-bento-card
            className="md:col-span-7 rounded-3xl bg-white border border-hairline p-8 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-offwhite border border-hairline flex items-center justify-center">
                <MessageSquareText className="size-6 text-ink" />
              </div>
              <span className="px-3 py-1 rounded-full bg-ink/5 border border-hairline text-ink text-xs font-bold">
                Conversational Insights
              </span>
            </div>

            {/* AI Advisor Bubble Graphic */}
            <div className="my-4 p-4 rounded-2xl bg-offwhite border border-hairline/60 space-y-1">
              <p className="text-xs font-bold text-purple uppercase tracking-wider">AI Advisor</p>
              <p className="text-xs sm:text-sm text-ink font-medium leading-[1.5]">
                &quot;You spent 40% more on food delivery this month compared to last month. Cap spend to save $340/mo.&quot;
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="display text-2xl font-bold tracking-tight text-ink">
                Plain-Language Insights
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-[1.6]">
                No confusing financial jargon — get plain-English feedback on your spending patterns.
              </p>
            </div>
          </div>

          {/* BENTO CARD 5: Full-Width 'What-If' Savings Simulator */}
          <div
            data-bento-card
            className="md:col-span-12 rounded-3xl bg-ink text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl border border-white/10 group"
          >
            <img
              src={blockSrc}
              alt="Capabilities Block"
              className="absolute -right-20 -bottom-20 w-96 h-auto object-contain opacity-20 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="absolute top-1/2 left-10 -translate-y-1/2 size-72 bg-purple/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-xl">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center">
                <Sliders className="size-6 text-lime" />
              </div>
              <h3 className="display text-2xl sm:text-4xl font-bold tracking-tight text-white">
                &apos;What-If&apos; Savings Simulator
              </h3>
              <p className="text-sm sm:text-base text-white/70 leading-[1.6]">
                Simulate cutting dining out or subscriptions by 15-30% and instantly visualize your projected annual compound savings.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <div className="w-full sm:w-auto p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center sm:text-left space-y-1">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Projected Growth</span>
                <p className="display text-3xl font-extrabold text-lime">+$3,840 / yr</p>
              </div>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 text-sm font-bold text-ink transition-transform hover:scale-105 shadow-lg"
              >
                <span>Try Simulator</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
