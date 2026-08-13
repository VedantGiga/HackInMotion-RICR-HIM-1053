"use client";

import { ArrowUpRight } from "lucide-react";
import { LineReveal, Reveal } from "@/lib/motion-primitives";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ink py-24 text-white md:py-32 lg:py-40">
      <div className="shell">
        <LineReveal
          className="display text-[clamp(2.2rem,6vw,4.6rem)]"
          lines={["Take control of your money", "with Koshin financial AI."]}
        />
        <Reveal className="mt-8 text-[17px] text-white/65">
          "Because you can't fix what you can't see — and most people can't see where their money actually goes."
        </Reveal>
        <Reveal delay={0.08} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#demo"
            className="group inline-flex items-center gap-5 rounded-full bg-purple py-3 pr-4 pl-7 text-ink transition-colors hover:bg-white shadow-lg"
          >
            <span className="text-[15px] font-semibold">Launch Koshin Dashboard</span>
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          <a
            href="#categorization"
            className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-[15px] font-medium transition-colors hover:border-white hover:bg-white/10"
          >
            Categorization Engine Docs
          </a>
        </Reveal>
      </div>
      <span className="absolute right-10 bottom-10 hidden size-16 bg-cyan md:block" aria-hidden />
    </section>
  );
}

