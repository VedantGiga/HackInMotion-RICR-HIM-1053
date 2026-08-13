"use client";

import { PieChart, LineChart, Wallet, MessageSquareText } from "lucide-react";
import cubes from "@/assets/overview-cubes.png";
import { Reveal, usePointerParallax } from "@/lib/motion-primitives";

const ITEMS = [
  {
    icon: PieChart,
    title: "NLP Auto-Categorization Engine",
    body: "Koshin automatically cleans raw bank data into clean categories — Groceries, Dining, Travel, Subscriptions — with 99.4% accuracy.",
  },
  {
    icon: LineChart,
    title: "Dynamic Financial Health Score",
    body: "A real-time 0–100 index calculated from your emergency savings buffer, debt ratio, spending velocity, and subscription load.",
  },
  {
    icon: Wallet,
    title: "Silent Subscription & Bill Detector",
    body: "Instantly detect sneaky recurring charges, unexpected price hikes, and forgotten streaming trials before they drain your account.",
  },
  {
    icon: MessageSquareText,
    title: "Conversational AI Advisor",
    body: "Ask natural questions like 'How much did I spend on dining out?' and get plain-English answers backed by your live data.",
  },
];

export function CardStackingSection() {
  const pointer = usePointerParallax(18);

  const cubesSrc = typeof cubes === "string" ? cubes : cubes.src;

  return (
    <section id="features" className="bg-white py-24 md:py-32 lg:py-40 border-t border-hairline relative overflow-hidden">
      <div className="shell grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        
        {/* Left Side: 3D Graphic Visual with Pointer Parallax & Accents */}
        <div ref={pointer} className="relative order-2 mx-auto w-full max-w-[520px] lg:order-1">
          <img
            src={cubesSrc}
            alt="Koshin intelligence graphics block"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full object-contain filter drop-shadow-2xl"
          />
          <span className="absolute top-[32%] left-[4%] size-6 bg-purple" aria-hidden />
          <span className="absolute bottom-[22%] right-[12%] size-10 bg-cyan" aria-hidden />
          <div className="absolute top-[22%] right-[14%] grid grid-cols-3 gap-3.5" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="size-[5px] bg-ink" />
            ))}
          </div>
        </div>

        {/* Right Side: Header + Clean 2-Column Capability Grid */}
        <div className="order-1 flex flex-col gap-12 lg:order-2">
          
          <div className="space-y-4">
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-[1.15]">
              Intelligence at every level.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Because you can&apos;t fix what you can&apos;t see — experience financial tools designed for precision, automation, and total clarity.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {ITEMS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06} className="group">
                <div className="size-12 rounded-2xl bg-offwhite border border-hairline flex items-center justify-center mb-6 transition-transform duration-500 group-hover:-translate-y-1 group-hover:border-purple/30 group-hover:bg-purple/5">
                  <f.icon
                    className="size-6 text-ink transition-colors duration-300 group-hover:text-purple"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="display text-lg font-semibold tracking-[-0.02em] text-ink">{f.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                  {f.body}
                </p>
              </Reveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
