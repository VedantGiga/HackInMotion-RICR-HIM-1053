import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { LineReveal, Reveal } from "@/lib/motion-primitives";

const CASES = [
  {
    title: ["Subscription", "Detector & Cleaner"],
    body: "Automatically flags repeating monthly bills, unused free trials, and silent price hikes.",
  },
  {
    title: ["Upcoming Bill", "Predictor & Reminders"],
    body: "Predicts recurring bills based on transaction history and alerts you before due dates.",
  },
  {
    title: ["AI Natural Language", "Financial Assistant"],
    body: "Ask questions like 'How much did I spend on food last month?' and get accurate instant answers.",
  },
];

const BACKGROUNDS = ["/bgimage.png", "/bgimage2.png", "/bgimage3.png"];

export function CaseStudies() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-black py-20 text-white md:py-28 lg:py-36 min-h-[680px] flex flex-col justify-center transition-colors duration-700"
    >
      {/* Background Image Layers (Black by default; fades in ONLY when hovered) */}
      {BACKGROUNDS.map((bg, idx) => {
        const isVisible = hoveredIndex === idx;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-700 ease-out pointer-events-none bg-cover bg-center ${
              isVisible ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        );
      })}

      {/* Dark Overlay when active */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-700 pointer-events-none ${
          hoveredIndex !== null ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="shell relative z-10 max-w-6xl mx-auto">
        <LineReveal
          className="display text-center text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight"
          lines={["From ambition to", "tangible results"]}
        />

        <div
          onMouseLeave={() => setHoveredIndex(null)}
          className="mt-12 grid gap-5 md:grid-cols-3 md:gap-5 items-stretch"
        >
          {CASES.map((c, i) => {
            const isHovered = hoveredIndex === i;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <Reveal key={c.title.join(" ")} delay={i * 0.08}>
                <article
                  onMouseEnter={() => setHoveredIndex(i)}
                  className={`group relative flex h-full min-h-[400px] sm:min-h-[430px] flex-col justify-between p-6 sm:p-8 transition-all duration-500 rounded-l-none rounded-r-[50%] md:rounded-r-[180px] cursor-pointer ${
                    isHovered
                      ? "bg-white text-ink shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] scale-[1.03] z-20"
                      : isAnyHovered
                      ? "border border-white/20 bg-black/40 text-white opacity-50 scale-100 z-10"
                      : "border border-white/30 bg-white/[0.03] backdrop-blur-sm text-white hover:border-white/60 scale-100 z-10"
                  }`}
                >
                  <div>
                    <h3 className="display max-w-[11ch] text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] font-bold tracking-tight">
                      {c.title.map((t) => (
                        <span key={t} className={`block ${isHovered ? "text-ink" : "text-white"}`}>
                          {t}
                        </span>
                      ))}
                    </h3>
                  </div>

                  <div className="mt-auto space-y-6">
                    <p
                      className={`max-w-[21ch] text-xs sm:text-sm leading-[1.6] ${
                        isHovered ? "text-muted-foreground font-normal" : "text-white/80 font-normal"
                      }`}
                    >
                      {c.body}
                    </p>

                    <div>
                      <a
                        href="#demo"
                        className={`inline-flex items-center justify-between gap-3 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                          isHovered
                            ? "border-ink/25 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white"
                            : "border-white/35 bg-white/5 text-white hover:border-white hover:bg-white/10"
                        }`}
                      >
                        <span>Read more</span>
                        <span
                          className={`grid size-6 place-items-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
                            isHovered ? "border-ink/25 text-current" : "border-white/35 text-white"
                          }`}
                        >
                          <ArrowRight className="size-3" strokeWidth={2} />
                        </span>
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
