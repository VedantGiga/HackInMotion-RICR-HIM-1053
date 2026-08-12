import { ArrowRight } from "lucide-react";
import { LineReveal, Reveal } from "@/lib/motion-primitives";
import { ParticleField } from "./ParticleField";

const CASES = [
  {
    title: ["Visa Innovation", "Program Europe"],
    body: "Cross-border acquiring and APM orchestration rolled out across 14 markets.",
    light: true,
  },
  {
    title: ["HackZone", "by Allianz"],
    body: "From collaboration to commercial success: scaling insurtech payment flows.",
  },
  {
    title: ["Kickstarting AI", "in Banking"],
    body: "Real-time risk scoring and adaptive routing deployed for a tier-one bank.",
  },
];

export function CaseStudies() {
  return (
    <section id="use-cases" className="relative overflow-hidden bg-navy py-24 text-white md:py-32 lg:py-40">
      <ParticleField />
      <div className="shell relative">
        <LineReveal
          className="display text-center text-[clamp(2.2rem,5.6vw,4.4rem)]"
          lines={["From ambition to", "tangible results"]}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-4">
          {CASES.map((c, i) => (
            <Reveal key={c.title.join(" ")} delay={i * 0.08}>
              <article
                className={`group flex h-full min-h-[420px] flex-col justify-between p-8 transition-transform duration-500 hover:-translate-y-2 ${
                  c.light
                    ? "bg-white text-ink rounded-r-[50%]"
                    : "border border-white/25 bg-white/[0.03] rounded-r-[50%]"
                }`}
              >
                <h3 className="display max-w-[10ch] text-[clamp(1.6rem,2.4vw,2.1rem)]">
                  {c.title.map((t) => (
                    <span key={t} className="block">
                      {t}
                    </span>
                  ))}
                </h3>
                <div>
                  <p
                    className={`max-w-[22ch] text-[15px] leading-[1.6] ${c.light ? "text-muted-foreground" : "text-white/75"}`}
                  >
                    {c.body}
                  </p>
                  <button
                    type="button"
                    className={`mt-8 inline-flex items-center gap-3 rounded-full border py-2 pr-2 pl-5 text-sm font-semibold transition-colors ${
                      c.light
                        ? "border-ink/25 hover:border-ink"
                        : "border-white/35 hover:border-white"
                    }`}
                  >
                    Read more
                    <span
                      className={`grid size-8 place-items-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
                        c.light ? "border-ink/25" : "border-white/35"
                      }`}
                    >
                      <ArrowRight className="size-4" strokeWidth={2} />
                    </span>
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
