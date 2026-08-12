"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  FileText,
  Sparkles,
  RefreshCw,
  Activity,
  BellRing,
  Sliders
} from "lucide-react";
import { LineReveal, Reveal, useGsapSetup } from "@/lib/motion-primitives";

const FEATURES = [
  {
    icon: FileText,
    title: "Zero Manual Tagging",
    body: "Upload statement CSVs or enter transactions. Koshin parses and classifies raw merchant data instantly.",
  },
  {
    icon: Sparkles,
    title: "Smart Categorization Engine",
    body: "Rule-based & AI/NLP categorization engine classifies items into Food, Rent, Subscriptions, Travel, and more.",
    outlined: true,
  },
  {
    icon: BellRing,
    title: "Subscription & Trial Detector",
    body: "Flags recurring subscriptions, forgotten free trials, and silent monthly price hikes before they drain your account.",
  },
  {
    icon: Activity,
    title: "Financial Health Score",
    body: "Generates an objective 0-100 score based on savings rate, income vs expense, and budget adherence.",
  },
  {
    icon: RefreshCw,
    title: "Plain-Language Insights",
    body: "Honest advisor feedback: 'You spent 40% more on food delivery this month compared to last month — cap spend to save $340/mo.'",
  },
  {
    icon: Sliders,
    title: "'What-If' Savings Simulator",
    body: "Simulate cutting dining out or subscriptions by X% and instantly visualize projected annual savings.",
  },
];

export function PerformanceSection() {
  const root = useRef<HTMLElement>(null);
  useGsapSetup();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-feature]", { opacity: 1, y: 0 });
      return;
    }
    const items = el.querySelectorAll("[data-feature]");
    gsap.set(items, { opacity: 0, y: 34 });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap.to(items, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 });
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="problem"
      ref={root}
      className="border-t border-hairline bg-offwhite py-24 md:py-32 lg:py-40"
    >
      <div className="shell grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <div className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">
            Real-World Problem & Solution
          </div>
          <LineReveal
            className="display text-[clamp(2rem,4.8vw,3.6rem)]"
            lines={["Raw Bank Statements", "are Cryptic. Koshin Gives", "You Honest Clarity."]}
          />
          <Reveal className="mt-7 max-w-md text-[17px] leading-[1.7] text-muted-foreground">
            Most people earn, spend, and end the month surprised by how little remains — without ever understanding why. Budgeting apps fail because manual entry is tedious. Koshin automates understanding.
          </Reveal>
        </div>

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-feature
              className={`group transition-colors duration-500 ${
                f.outlined
                  ? "border border-hairline bg-background p-7 hover:border-ink"
                  : "p-1 sm:p-0"
              }`}
            >
              <f.icon
                className="size-7 transition-transform duration-500 group-hover:-translate-y-1 text-ink"
                strokeWidth={1.5}
              />
              <h3 className="display mt-7 text-lg tracking-[-0.02em] text-ink">{f.title}</h3>
              <p className="mt-3 max-w-[15rem] text-[15px] leading-[1.7] text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

