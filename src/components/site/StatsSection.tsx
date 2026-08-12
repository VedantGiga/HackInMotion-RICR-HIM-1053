import { Reveal } from "@/lib/motion-primitives";

const STATS = [
  { label: "Merchants processing.", value: "250+" },
  { label: "Annual volume routed.", value: "$140M+" },
  { label: "Acquirer connections.", value: "90+" },
  { label: "Average go-live time.", value: "9 days" },
];

export function StatsSection() {
  return (
    <section id="about" className="border-t border-hairline py-24 md:py-32 lg:py-40">
      <div className="shell">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className="grid items-center gap-4 border-b border-hairline py-8 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:py-12">
              <h3 className="display max-w-[12ch] text-xl md:text-2xl">{s.label}</h3>
              <p
                className="display text-[clamp(3.4rem,12vw,9rem)] leading-[0.9]"
                style={{ color: i % 2 === 0 ? "var(--pinkish)" : "var(--ink)" }}
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
