import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  CreditCard,
  DollarSign,
  ArrowRightLeft,
  ShieldCheck,
  Square,
  PieChart,
} from "lucide-react";
import { LineReveal, Reveal, useGsapSetup } from "@/lib/motion-primitives";

const FEATURES = [
  {
    icon: CreditCard,
    title: "Full Card Support",
    body: "Visa, Mastercard, Amex, JCB and more",
  },
  {
    icon: DollarSign,
    title: "Alternative Payments",
    body: "Pix, Blik, SEPA, Open Banking, and more",
    outlined: true,
  },
  {
    icon: ArrowRightLeft,
    title: "Card Tools",
    body: "Tokenization, BIN-routing, Cascading, Load Balancing",
  },
  {
    icon: ShieldCheck,
    title: "Fraud Prevention",
    body: "3DS2, Velocity Checks, Real-time Risk Scoring",
  },
  {
    icon: Square,
    title: "Merchant Tools",
    body: "Intuitive Dashboard, Reporting, Reconciliation",
  },
  {
    icon: PieChart,
    title: "White-Label Power",
    body: "Custom domain, branding & invoice templates",
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
      id="integrations"
      ref={root}
      className="border-t border-hairline bg-offwhite py-24 md:py-32 lg:py-40"
    >
      <div className="shell grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <LineReveal
            className="display text-[clamp(2rem,5.2vw,4rem)]"
            lines={["Engineered for", "Performance. Designed", "for Scale."]}
          />
          <Reveal className="mt-7 max-w-md text-[17px] leading-[1.7] text-muted-foreground">
            MatrixPay combines powerful financial infrastructure with cutting-edge payment
            technologies, helping you go live in days—not months.
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
                className="size-7 transition-transform duration-500 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
              <h3 className="display mt-7 text-lg tracking-[-0.02em]">{f.title}</h3>
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
