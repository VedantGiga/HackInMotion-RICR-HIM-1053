import { ArrowUpRight } from "lucide-react";
import { LineReveal, Reveal } from "@/lib/motion-primitives";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ink py-24 text-white md:py-32 lg:py-40">
      <div className="shell">
        <LineReveal
          className="display text-[clamp(2.2rem,6vw,4.6rem)]"
          lines={["Build the payment infrastructure", "your business deserves."]}
        />
        <Reveal className="mt-8 text-[17px] text-white/65">
          Launch faster. Scale further. Stay in control.
        </Reveal>
        <Reveal delay={0.08} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#top"
            className="group inline-flex items-center gap-6 bg-lime py-3 pr-3 pl-6 text-ink transition-colors hover:bg-white"
          >
            <span className="text-[15px] font-semibold">Talk to MatrixPay</span>
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          <a
            href="#overview"
            className="inline-flex items-center border border-white/30 px-6 py-3 text-[15px] font-medium transition-colors hover:border-white"
          >
            Explore the platform
          </a>
        </Reveal>
      </div>
      <span className="absolute right-10 bottom-10 hidden size-16 bg-cyan md:block" aria-hidden />
    </section>
  );
}
