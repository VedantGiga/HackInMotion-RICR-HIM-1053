import { Reveal } from "@/lib/motion-primitives";

const STATS = [
  { label: "Transactions analyzed.", value: "$4.2M+" },
  { label: "Auto-categorization accuracy.", value: "98.6%" },
  { label: "Avg monthly user savings boost.", value: "18.4%" },
  { label: "Bank-grade data privacy.", value: "100%" },
];

export function StatsSection() {
  return (
    <section id="about" className="border-t border-hairline py-24 md:py-32 lg:py-40">
      <div className="shell">
        <div className="text-xs font-semibold text-ink uppercase tracking-widest mb-6">
          Platform Metrics & Impact
        </div>
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className="grid items-center gap-4 border-b border-hairline py-8 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:py-12">
              <h3 className="display max-w-[14ch] text-xl md:text-2xl text-ink">{s.label}</h3>
              <p
                className="display text-[clamp(3.4rem,12vw,9rem)] leading-[0.9]"
                style={{ color: i % 2 === 0 ? "var(--brandblue)" : "var(--ink)" }}
              >
                {s.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

