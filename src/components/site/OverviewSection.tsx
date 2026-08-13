"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  UploadCloud,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from "lucide-react";
import overviewCubes from "@/assets/overview-cubes.png";
import heroTorus from "@/assets/hero-torus.png";
import capabilitiesBlock from "@/assets/capabilities-block.png";

const STEPS = [
  {
    step: "01",
    phase: "PHASE 01",
    title: "Connect & Ingest Statements",
    subtitle: "256-Bit Encrypted Statement Parsing",
    desc: "Upload bank statement PDF/CSV or connect via 256-bit encrypted bank API. Koshin extracts and structures 1,000+ line items in under 0.4 seconds.",
    tag: "Bank-Grade Privacy",
    icon: UploadCloud,
    badge: "0.4s Ingestion",
    accentColor: "from-ink via-navy to-black",
    glowColor: "bg-cyan/15",
    img: overviewCubes,
    details: [
      "Supports 40+ major Indian & global banks",
      "No account passwords or credentials stored",
      "Parses 1,000+ transaction lines in < 0.4s"
    ]
  },
  {
    step: "02",
    phase: "PHASE 02",
    title: "AI Vector Audit & Categorization",
    subtitle: "Hybrid NLP Categorization Engine",
    desc: "Koshin's vector NLP engine categorizes messy transactions (like 'TST* SBUX 4921') into Food, Subscriptions, Rent, and Travel with 99.4% precision.",
    tag: "99.4% Precision",
    icon: Cpu,
    badge: "Vector NLP Active",
    accentColor: "from-purple via-purple-dark to-ink",
    glowColor: "bg-lime/15",
    img: heroTorus,
    details: [
      "Merchant MCC & keyword pattern matching",
      "Silent recurring subscription detector",
      "Automatic confidence score verification"
    ]
  },
  {
    step: "03",
    phase: "PHASE 03",
    title: "Actionable Financial Health Roadmap",
    subtitle: "Complete Financial Clarity",
    desc: "Receive your objective 0–100 Financial Health Index, tailored category budgets, leak warnings, and plain-language spend recommendations.",
    tag: "84/100 Health Score",
    icon: TrendingUp,
    badge: "+$3,840/yr Savings",
    accentColor: "from-black via-ink to-navy",
    glowColor: "bg-purple/20",
    img: capabilitiesBlock,
    details: [
      "0–100 Weighted Financial Health Score",
      "Overspend alerts & monthly runway estimate",
      "Personalized annual savings opportunities"
    ]
  }
];

export function OverviewSection() {
  const rootRef = useRef<HTMLElement>(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.fromTo(
        "[data-stack-header]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={rootRef}
      className="relative bg-white py-24 md:py-36 text-ink overflow-hidden"
    >
      {/* Background dot matrix field */}
      <div
        className="dot-field pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />

      <div className="shell relative z-10 max-w-7xl mx-auto space-y-16">

        {/* Header Block */}
        <div data-stack-header className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink">
            How Koshin Works.
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            From raw bank statements to complete financial clarity in under 3 seconds. No manual spreadsheet entry required.
          </p>
        </div>

        {/* ULTRA-PREMIUM STICKY STACKING CARDS CONTAINER */}
        <div className="space-y-8 relative max-w-5xl mx-auto pb-16">
          {STEPS.map((s, idx) => {
            const IconComp = s.icon;
            const imgSrc = typeof s.img === "string" ? s.img : s.img.src;

            return (
              <div
                key={s.step}
                className={`sticky rounded-[2.5rem] bg-gradient-to-br ${s.accentColor} text-white p-8 sm:p-14 shadow-2xl border border-white/15 relative overflow-hidden flex flex-col justify-between min-h-[440px] group transition-all duration-500`}
                style={{
                  top: `calc(90px + ${idx * 24}px)`,
                }}
              >
                {/* Background Ambient Glows & 3D Visual Graphic */}
                <div className={`absolute top-0 right-0 size-96 ${s.glowColor} rounded-full blur-3xl pointer-events-none`} />
                <img
                  src={imgSrc}
                  alt={s.title}
                  className="absolute -right-16 -bottom-16 w-80 sm:w-[420px] h-auto object-contain opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Top Card Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="display text-3xl font-extrabold text-white/40 group-hover:text-lime transition-colors">
                      {s.step}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                      {s.phase}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex text-xs font-semibold text-white/70 bg-white/10 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                      {s.tag}
                    </span>
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-lime">
                      <IconComp className="size-6" />
                    </div>
                  </div>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 my-8 space-y-4 max-w-2xl">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-light block">
                    {s.subtitle}
                  </span>

                  <h3 className="display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.2]">
                    {s.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/80 leading-[1.65] font-normal">
                    {s.desc}
                  </p>

                  {/* Bullet Highlights Grid */}
                  <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                    {s.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs text-white/90 font-medium">
                        <CheckCircle2 className="size-3.5 text-lime shrink-0" />
                        <span className="truncate">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action Bar */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-2 font-mono">
                    <ShieldCheck className="size-4 text-lime" />
                    <span>Instant Execution Engine</span>
                  </div>

                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-2.5 text-xs font-bold text-ink transition-transform hover:scale-105 shadow-md"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
