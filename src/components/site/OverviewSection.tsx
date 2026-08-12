"use client";

import cubes from "@/assets/overview-cubes.png";
import personA from "@/assets/person-a.jpg";
import { LineReveal, Reveal, usePointerParallax, useScrollParallax } from "@/lib/motion-primitives";

const BLOCKS = [
  {
    n: "01",
    body: "Rule-Based + AI/NLP Hybrid Engine: Merchant descriptions are matched against deterministic keyword patterns and natural language vector embeddings.",
  },
  {
    n: "02",
    body: "8 Core Categories: Automatically tags Food & Dining, Housing & Rent, Subscriptions, Travel, Bills & Utilities, Shopping, Salary, and Entertainment.",
  },
  {
    n: "03",
    body: "Confidence Score: Every transaction is assigned a 0–100% confidence rating, allowing user override and active engine learning.",
  },
  {
    n: "04",
    body: "Recurrence Detection: Identifies recurring billing cycles to flag silent price increases, unused trials, and upcoming bill due dates.",
  },
];

const LABELS = [
  { text: "Food & Dining", top: "26%", left: "0%" },
  { text: "Subscriptions", top: "58%", left: "4%" },
  { text: "Housing & Rent", top: "78%", left: "16%" },
  { text: "Travel & Transport", top: "12%", left: "22%" },
  { text: "NLP Categorizer", top: "44%", left: "-4%" },
];

export function OverviewSection() {
  const pointer = usePointerParallax(18);
  const drift = useScrollParallax(60);

  return (
    <section id="categorization" className="border-t border-hairline py-24 md:py-32 lg:py-40">
      <div className="shell grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal className="text-xs font-semibold text-ink uppercase tracking-widest">Technical Core</Reveal>
          <LineReveal className="display mt-4 text-[clamp(2.2rem,5.6vw,4.2rem)]" lines={["The Automatic", "Categorization Engine"]} />
          <Reveal className="mt-6 text-[17px] leading-[1.7] text-muted-foreground">
            No more manual tagging. Koshin’s hybrid engine parses messy bank statement strings like <code className="bg-hairline px-2 py-0.5 rounded text-ink text-sm">DD *DOORDASH SAN FRANCISCO</code> and turns them into clean, structured data categories in milliseconds.
          </Reveal>
        </div>

        <div ref={drift} className="relative">
          <div ref={pointer} className="relative">
            <img
              src={typeof cubes === "string" ? cubes : cubes.src}
              alt="Koshin categorization engine visualization"
              width={1200}
              height={1200}
              loading="lazy"
              className="w-full object-contain"
            />
            <span className="absolute top-[18%] right-[8%] size-5 bg-purple" aria-hidden />
            <span className="absolute top-[32%] left-[38%] size-10 bg-cyan" aria-hidden />
            <span className="absolute top-[24%] right-[26%] size-2 bg-pinkish" aria-hidden />
            <img
              src={typeof personA === "string" ? personA : personA.src}
              alt="Koshin auto tag example"
              width={512}
              height={640}
              loading="lazy"
              className="absolute right-[6%] bottom-[16%] size-16 object-cover border border-ink"
            />
          </div>

          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M12 30 C 26 30, 30 26, 40 25" stroke="currentColor" className="text-hairline" strokeWidth="0.2" fill="none" />
            <path d="M14 60 C 26 58, 32 40, 42 34" stroke="currentColor" className="text-grayed" strokeWidth="0.2" fill="none" />
            <path d="M20 80 C 30 78, 34 66, 44 60" stroke="currentColor" className="text-hairline" strokeWidth="0.2" fill="none" />
          </svg>

          {LABELS.map((l) => (
            <span
              key={l.text}
              style={{ top: l.top, left: l.left }}
              className="absolute hidden border border-hairline bg-background px-3 py-1.5 text-xs text-ink font-semibold md:inline-block shadow-sm"
            >
              {l.text}
            </span>
          ))}
        </div>
      </div>

      <div className="shell mt-20 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
        {BLOCKS.map((b) => (
          <Reveal key={b.n}>
            <p className="text-sm font-bold text-ink">{b.n}</p>
            <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">{b.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

