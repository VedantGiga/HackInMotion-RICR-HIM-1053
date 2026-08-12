import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import torus from "@/assets/hero-torus.png";
import personA from "@/assets/person-a.jpg";
import personB from "@/assets/person-b.jpg";
import { usePointerParallax } from "@/lib/motion-primitives";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const parallax = usePointerParallax(26);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-anim]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-line]", { yPercent: 0 });
        gsap.set("[data-hero-object]", { opacity: 1, scale: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-dot]", { opacity: 0, scale: 0, duration: 0.6, stagger: 0.012 }, 0.1)
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" },
          0.2,
        )
        .from("[data-hero-copy]", { opacity: 0, y: 26, duration: 0.9 }, 0.7)
        .from("[data-hero-cta]", { opacity: 0, y: 18, scale: 0.96, duration: 0.8 }, 0.85)
        .fromTo(
          "[data-hero-object]",
          { opacity: 0, scale: 0.86, rotate: -8 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.6, ease: "expo.out" },
          0.25,
        )
        .from(
          "[data-hero-float]",
          { opacity: 0, y: 24, scale: 0.9, duration: 0.8, stagger: 0.12 },
          1.1,
        );

      gsap.to("[data-hero-object]", {
        y: 18,
        rotate: 2,
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative overflow-hidden pt-28 pb-16 md:pt-36 lg:min-h-screen lg:pt-40"
    >
      <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
        <div className="relative">
          <div
            className="pointer-events-none absolute -top-16 -left-2 hidden gap-[86px] md:flex"
            aria-hidden
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} data-hero-dot className="size-[3px] rounded-full bg-ink" />
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/30 border border-ink/20 rounded-full text-xs font-semibold text-ink uppercase tracking-wider mb-6">
            <Sparkles className="size-3.5" /> FinTech & Personal Finance AI
          </div>

          <h1 className="display text-[clamp(2.4rem,8vw,5.4rem)]">
            {["Smart Expense", "Analyzer & Financial", "Health Dashboard"].map((l) => (
              <span key={l} className="line-mask">
                <span data-hero-line className="block will-change-transform">
                  {l}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-copy
            className="mt-8 max-w-[32rem] text-[17px] leading-[1.7] text-muted-foreground"
          >
            <em>"Because you can't fix what you can't see — and most people can't see where their money actually goes."</em>
            <br />
            <span className="mt-2 block font-normal text-ink/80">
              Koshin turns raw bank transactions into real financial clarity, auto-categorized insights, and honest personalized advice in your pocket.
            </span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              data-hero-cta
              href="#demo"
              className="group inline-flex items-center gap-6 border border-ink bg-ink text-background py-2.5 pr-2 pl-6 transition-colors hover:bg-lime hover:text-ink hover:border-ink"
            >
              <span className="text-[15px] font-semibold">Try Interactive Dashboard</span>
              <span className="grid size-9 place-items-center bg-lime text-ink transition-transform duration-300 group-hover:translate-y-1">
                <ArrowDown className="size-4" strokeWidth={2} />
              </span>
            </a>

            <a
              href="#categorization"
              className="inline-flex items-center gap-2 border border-hairline py-3 px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink"
            >
              Auto-Categorization Engine
            </a>
          </div>

          <div
            className="dot-field pointer-events-none absolute -bottom-16 left-0 hidden h-6 w-[560px] opacity-70 md:block"
            aria-hidden
          />
        </div>

        <div ref={parallax} className="relative mx-auto w-full max-w-[640px]">
          <img
            data-hero-object
            src={torus}
            alt="Koshin financial intelligence graphic"
            width={1200}
            height={1200}
            className="w-full object-contain will-change-transform"
          />

          <div
            data-hero-float
            className="absolute top-[10%] right-[2%] w-32 overflow-hidden rounded-xl border border-hairline bg-background shadow-xl sm:w-44 p-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <ShieldCheck className="size-4 text-emerald-600" /> Koshin Health Score
            </div>
            <div className="text-2xl font-extrabold text-ink my-1">78 / 100</div>
            <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              Good & Healthy
            </div>
          </div>

          <div data-hero-float className="absolute bottom-[18%] left-[0%] flex items-end shadow-2xl">
            <img
              src={personB}
              alt="Koshin user"
              width={512}
              height={512}
              loading="lazy"
              className="size-14 object-cover sm:size-16"
            />
            <div className="-ml-2 bg-cyan px-4 py-2.5 text-ink border border-ink/10">
              <p className="text-[11px] font-semibold uppercase tracking-wide">Auto-Categorized</p>
              <p className="text-[14px] font-bold">DoorDash Food Delivery</p>
              <p className="text-[11px] font-mono text-ink/80">$48.50 • Food & Dining</p>
            </div>
          </div>

          <span
            data-hero-float
            className="absolute top-[46%] right-[6%] size-4 bg-lime"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

