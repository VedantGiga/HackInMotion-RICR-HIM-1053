import cubes from "@/assets/overview-cubes.png";
import personA from "@/assets/person-a.jpg";
import { LineReveal, Reveal, usePointerParallax, useScrollParallax } from "@/lib/motion-primitives";

const BLOCKS = [
  {
    n: "01",
    body: "MatrixPay is a global, startup-friendly white-label payment gateway built for scale.",
  },
  {
    n: "02",
    body: "Built to plug into your business with ease, MatrixPay delivers blazing-fast onboarding, powerful developer tools, and access to a vast network of acquirers, APMs, and banking rails.",
  },
  { n: "03", body: "Flexible infrastructure designed around your business model." },
  { n: "04", body: "Powerful payment capabilities without sacrificing control or customization." },
];

const LABELS = [
  { text: "white-label", top: "26%", left: "0%" },
  { text: "payment", top: "58%", left: "4%" },
  { text: "banking rails", top: "78%", left: "16%" },
  { text: "API", top: "12%", left: "22%" },
  { text: "security", top: "44%", left: "-4%" },
];

export function OverviewSection() {
  const pointer = usePointerParallax(18);
  const drift = useScrollParallax(60);

  return (
    <section id="overview" className="border-t border-hairline py-24 md:py-32 lg:py-40">
      <div className="shell grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal className="text-sm text-muted-foreground">Overview</Reveal>
          <LineReveal className="display mt-4 text-[clamp(2.2rem,5.6vw,4.2rem)]" lines={["What is MatrixPay?"]} />
        </div>

        <div ref={drift} className="relative">
          <div ref={pointer} className="relative">
            <img
              src={cubes}
              alt="MatrixPay modular payment infrastructure"
              width={1200}
              height={1200}
              loading="lazy"
              className="w-full object-contain"
            />
            <span className="absolute top-[18%] right-[8%] size-5 bg-lime" aria-hidden />
            <span className="absolute top-[32%] left-[38%] size-10 bg-cyan" aria-hidden />
            <span className="absolute top-[24%] right-[26%] size-2 bg-pinkish" aria-hidden />
            <img
              src={personA}
              alt="MatrixPay partner"
              width={512}
              height={640}
              loading="lazy"
              className="absolute right-[6%] bottom-[16%] size-16 object-cover"
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
              className="absolute hidden border border-hairline bg-background px-3 py-1.5 text-xs text-muted-foreground md:inline-block"
            >
              {l.text}
            </span>
          ))}
        </div>
      </div>

      <div className="shell mt-20 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
        {BLOCKS.map((b, i) => (
          <Reveal key={b.n} delay={i * 0.06}>
            <p className="text-sm text-muted-foreground">{b.n}</p>
            <p className="mt-6 text-[16px] leading-[1.7]">{b.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
