"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import torus from "@/assets/hero-torus.png";
import { usePointerParallax } from "@/lib/motion-primitives";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const parallax = usePointerParallax(26);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-anim]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-title]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-object]", { opacity: 1, scale: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-dot]", { opacity: 0, scale: 0, duration: 0.6, stagger: 0.012 }, 0.1)
        .fromTo(
          "[data-hero-title]",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
          0.2,
        )
        .from("[data-hero-copy]", { opacity: 0, y: 26, duration: 0.9 }, 0.6)
        .fromTo(
          "[data-hero-object]",
          { opacity: 0, scale: 0.86, rotate: -8 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.6, ease: "expo.out" },
          0.25,
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
      className="relative overflow-hidden pt-20 pb-16 md:pt-24 lg:min-h-screen lg:pt-28"
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

          <h1 data-hero-title className="display text-[clamp(2.6rem,7.5vw,5.2rem)] font-extrabold tracking-tight text-ink leading-[1.15]">
            Smart Financial <br />
            <span className="text-purple">Intelligence.</span>
          </h1>

          <p
            data-hero-copy
            className="mt-6 max-w-[28rem] text-[16px] leading-[1.65] text-muted-foreground"
          >
            Automated transaction categorization, instant financial health score, and honest guidance in your pocket.
          </p>

          <div
            className="dot-field pointer-events-none absolute -bottom-16 left-0 hidden h-6 w-[560px] opacity-70 md:block"
            aria-hidden
          />
        </div>

        <div ref={parallax} className="relative mx-auto w-full max-w-[640px]">
          <img
            data-hero-object
            src={typeof torus === "string" ? torus : torus.src}
            alt="Koshin financial intelligence graphic"
            width={1200}
            height={1200}
            className="w-full object-contain will-change-transform"
          />
        </div>
      </div>
    </section>
  );
}

