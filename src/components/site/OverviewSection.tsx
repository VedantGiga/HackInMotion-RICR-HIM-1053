"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  UploadCloud, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Lock,
  Zap,
  BarChart3,
  ChevronRight
} from "lucide-react";
import cubes from "@/assets/overview-cubes.png";
import personA from "@/assets/person-a.jpg";
import { usePointerParallax } from "@/lib/motion-primitives";

const STEPS = [
  {
    step: "01",
    title: "Connect & Upload",
    subtitle: "Instant Statement Parsing",
    desc: "Upload your PDF or CSV bank statement, or connect your account with zero-knowledge AES-256 encryption.",
    tag: "Bank-Grade Privacy",
    icon: UploadCloud,
    badge: "Drag & Drop PDF/CSV",
    details: [
      "Supports 40+ major Indian and global banks",
      "No account passwords or credentials stored",
      "Parse 1,000+ line items in under 2 seconds",
    ],
  },
  {
    step: "02",
    title: "AI Categorization & Audit",
    desc: "Koshin's hybrid NLP vector model categorizes unstructured transactions, identifies recurring bills, and flags silent money leaks.",
    subtitle: "Real-Time Engine Audit",
    tag: "99.4% Vector Match",
    icon: Cpu,
    badge: "Auto-Tagging Active",
    details: [
      "Merchant MCC & keyword pattern matching",
      "Silent recurring subscription detector",
      "Automatic confidence score calculation",
    ],
  },
  {
    step: "03",
    title: "Actionable Health Roadmap",
    subtitle: "Complete Financial Clarity",
    desc: "Receive your 0–100 Financial Health Index, tailored category budgets, and plain-language spend recommendations.",
    tag: "Instant Insights",
    icon: TrendingUp,
    badge: "Health Score 84/100",
    details: [
      "0–100 Weighted Financial Health Index",
      "Overspend alerts & monthly runway estimate",
      "Personalized savings opportunities",
    ],
  },
];

export function OverviewSection() {
  const rootRef = useRef<HTMLElement>(null);
  const pointerRef = usePointerParallax(16);
  const [activeStep, setActiveStep] = useState(0);

  // GSAP animations for smooth scroll triggers
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-step-anim]", { opacity: 1, y: 0 });
        return;
      }

      const elements = gsap.utils.toArray<HTMLElement>("[data-step-anim]");
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={rootRef}
      className="relative border-y border-hairline bg-white py-24 md:py-32 text-ink overflow-hidden"
    >
      {/* Koshin signature background dot matrix grid */}
      <div
        className="dot-field pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />

      <div className="shell relative z-10 max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div data-step-anim className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-ink shadow-2xs">
            <Sparkles className="size-3.5 text-purple" />
            <span>Simple 3-Step Process</span>
          </div>

          <h2 data-step-anim className="display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink">
            How Koshin Works.
          </h2>

          <p data-step-anim className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            From raw bank statements to complete financial clarity in under 3 seconds. No manual spreadsheet entry required.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="mt-16 lg:mt-24 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, idx) => {
            const IconComp = s.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={s.step}
                data-step-anim
                onClick={() => setActiveStep(idx)}
                className={`group relative rounded-3xl border p-6 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-white border-ink shadow-xl ring-1 ring-ink/10 -translate-y-1"
                    : "bg-background/80 border-hairline hover:border-ink/40 hover:bg-white hover:-translate-y-0.5 shadow-xs"
                }`}
              >
                <div>
                  {/* Top Step Pill & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="display text-2xl font-extrabold text-ink/30 group-hover:text-purple transition-colors">
                      {s.step}
                    </span>
                    <div className={`p-3 rounded-2xl border transition-colors ${
                      isActive ? "bg-purple text-white border-purple" : "bg-offwhite text-ink border-hairline group-hover:border-purple/40"
                    }`}>
                      <IconComp className="size-5" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple block mb-1">
                    {s.subtitle}
                  </span>
                  
                  <h3 className="display text-xl font-bold text-ink tracking-tight mb-3">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                    {s.desc}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2 border-t border-hairline/80 pt-4">
                    {s.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-ink/80 font-medium">
                        <CheckCircle2 className="size-3.5 text-purple shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-hairline/60 flex items-center justify-between text-xs font-semibold text-ink">
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2.5 py-0.5 rounded border border-hairline">
                    {s.tag}
                  </span>
                  <ChevronRight className={`size-4 transition-transform ${isActive ? "text-purple translate-x-1" : "text-ink/30 group-hover:translate-x-1"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Visual Preview Box */}
        <div data-step-anim className="mt-16 lg:mt-20 rounded-3xl border border-hairline bg-offwhite/50 p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Active Step Description & Context */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 text-ink text-xs font-semibold border border-cyan/20">
                <Zap className="size-3.5 text-cyan" /> Step {STEPS[activeStep].step} Spotlight
              </div>
              
              <h3 className="display text-2xl sm:text-3xl font-bold text-ink">
                {STEPS[activeStep].title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {STEPS[activeStep].desc}
              </p>

              <div className="pt-2">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-white px-5 py-2.5 text-xs font-bold transition-all hover:bg-purple hover:border-purple shadow-sm"
                >
                  <span>Experience Interactive Demo</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Visual Showcase Graphics */}
            <div className="lg:col-span-7 relative">
              <div className="rounded-2xl border border-hairline bg-white p-6 shadow-md relative">
                
                {/* Step 1 Visual Mockup */}
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-hairline">
                      <span className="text-xs font-bold text-ink flex items-center gap-2">
                        <Lock className="size-3.5 text-purple" /> Statement File Upload
                      </span>
                      <span className="text-[10px] font-mono text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                        256-Bit Encrypted
                      </span>
                    </div>

                    <div className="border-2 border-dashed border-hairline rounded-xl p-6 text-center bg-offwhite hover:border-purple/50 transition-colors">
                      <UploadCloud className="size-8 text-purple mx-auto mb-2" />
                      <p className="text-xs font-bold text-ink">Drop your Bank Statement PDF/CSV here</p>
                      <p className="text-[11px] text-muted-foreground mt-1">HDFC, ICICI, SBI, Axis, Zerodha, or custom CSV</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>Status: Ready to parse</span>
                      <span className="text-ink font-semibold">0.4 sec processing time</span>
                    </div>
                  </div>
                )}

                {/* Step 2 Visual Mockup */}
                {activeStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-hairline">
                      <span className="text-xs font-bold text-ink flex items-center gap-2">
                        <Cpu className="size-3.5 text-purple" /> Auto-Categorizer Engine
                      </span>
                      <span className="text-[10px] font-mono text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                        99.4% Match Rate
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl border border-hairline bg-offwhite flex items-center justify-between text-xs">
                        <span className="font-mono text-muted-foreground truncate max-w-[200px]">DD *DOORDASH SAN FRANCISCO</span>
                        <span className="font-bold text-ink bg-cyan/20 px-2.5 py-0.5 rounded">Food & Dining • $48.50</span>
                      </div>
                      <div className="p-3 rounded-xl border border-hairline bg-offwhite flex items-center justify-between text-xs">
                        <span className="font-mono text-muted-foreground truncate max-w-[200px]">NETFLIX.COM RECURRING</span>
                        <span className="font-bold text-ink bg-purple/20 px-2.5 py-0.5 rounded">Subscriptions • $19.99</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 Visual Mockup */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-hairline">
                      <span className="text-xs font-bold text-ink flex items-center gap-2">
                        <BarChart3 className="size-3.5 text-purple" /> Financial Health Audit
                      </span>
                      <span className="text-[10px] font-mono text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                        Actionable Plan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border border-hairline bg-offwhite text-center">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Health Index</span>
                        <div className="text-2xl font-extrabold text-ink mt-1">84 / 100</div>
                        <span className="text-[10px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full inline-block mt-1">Strong Reserve</span>
                      </div>
                      <div className="p-4 rounded-xl border border-hairline bg-cyan/10 text-center">
                        <span className="text-[10px] font-bold uppercase text-ink/70">Potential Savings</span>
                        <div className="text-2xl font-extrabold text-ink mt-1">+$320 / mo</div>
                        <span className="text-[10px] font-semibold text-ink bg-white px-2 py-0.5 rounded-full inline-block mt-1">3 Leaks Flagged</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}




