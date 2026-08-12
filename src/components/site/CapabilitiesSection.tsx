import { Square, PieChart, Code2, LifeBuoy, Boxes } from "lucide-react";
import block from "@/assets/capabilities-block.png";
import { Reveal, usePointerParallax } from "@/lib/motion-primitives";

const ITEMS = [
  { icon: Square, title: "Merchant Tools", body: "Intuitive Dashboard, Reporting, Reconciliation" },
  { icon: PieChart, title: "White-Label Power", body: "Custom domain, branding & invoice templates" },
  { icon: Code2, title: "Developer Friendly", body: "RESTful APIs, Hosted Checkout, SDKs, Sandbox" },
  {
    icon: LifeBuoy,
    title: "24/7 Support",
    body: "Dedicated account manager, technical support, onboarding assistance",
  },
  {
    icon: Boxes,
    title: "Flexible Deployment",
    body: "MatrixPay can be run cloud-based or installed on-premise",
  },
];

export function CapabilitiesSection() {
  const pointer = usePointerParallax(16);

  return (
    <section id="highlights" className="border-t border-hairline bg-offwhite py-24 md:py-32 lg:py-40">
      <div className="shell grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div ref={pointer} className="relative order-2 mx-auto w-full max-w-[520px] lg:order-1">
          <img
            src={block}
            alt="MatrixPay deployment architecture block"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full object-contain"
          />
          <span className="absolute top-[38%] left-[2%] size-6 bg-cyan" aria-hidden />
          <span className="absolute bottom-[18%] right-[16%] size-10 bg-lime" aria-hidden />
          <div className="absolute top-[26%] right-[18%] grid grid-cols-3 gap-4" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="size-[5px] bg-ink" />
            ))}
          </div>
        </div>

        <div className="order-1 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:order-2">
          {ITEMS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05} className="group">
              <f.icon
                className="size-7 transition-transform duration-500 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
              <h3 className="display mt-7 text-lg tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-3 max-w-[15rem] text-[15px] leading-[1.7] text-muted-foreground">
                {f.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
