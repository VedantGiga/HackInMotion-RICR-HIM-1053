import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
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

          <h1 className="display text-[clamp(2.6rem,10vw,6.2rem)]">
            {["Smarter", "Payments", "Start Here"].map((l) => (
              <span key={l} className="line-mask">
                <span data-hero-line className="block will-change-transform">
                  {l}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-copy
            className="mt-8 max-w-[30rem] text-[17px] leading-[1.7] text-muted-foreground"
          >
            MatrixPay is a modern, white-label payment gateway designed for fintechs, PSPs, ISOs,
            and ambitious merchants. Fast, flexible, and fully customizable.
          </p>

          <a
            data-hero-cta
            href="#integrations"
            className="group mt-10 inline-flex items-center gap-8 border border-ink py-2 pr-2 pl-5 transition-colors hover:bg-ink hover:text-background"
          >
            <span className="text-[15px] font-medium">Discover</span>
            <span className="grid size-9 place-items-center bg-lime text-ink transition-transform duration-300 group-hover:translate-y-1">
              <ArrowDown className="size-4" strokeWidth={2} />
            </span>
          </a>

          <div
            className="dot-field pointer-events-none absolute -bottom-16 left-0 hidden h-6 w-[560px] opacity-70 md:block"
            aria-hidden
          />
        </div>

        <div ref={parallax} className="relative mx-auto w-full max-w-[640px]">
          <img
            data-hero-object
            src={torus}
            alt="MatrixPay interlocking wireframe payment rails"
            width={1200}
            height={1200}
            className="w-full object-contain will-change-transform"
          />

          <div
            data-hero-float
            className="absolute top-[14%] right-[2%] w-24 overflow-hidden sm:w-32"
          >
            <img
              src={personA}
              alt="Merchant using MatrixPay checkout"
              width={512}
              height={640}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div data-hero-float className="absolute bottom-[22%] left-[0%] flex items-end">
            <img
              src={personB}
              alt="MatrixPay customer"
              width={512}
              height={512}
              loading="lazy"
              className="size-14 object-cover sm:size-16"
            />
            <div className="-ml-2 bg-cyan px-3 py-2 text-ink">
              <p className="text-[11px] font-medium">Payment Send</p>
              <p className="text-[15px] font-bold">$ 35.04</p>
              <p className="text-[10px] opacity-70">12th May, 2025</p>
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
