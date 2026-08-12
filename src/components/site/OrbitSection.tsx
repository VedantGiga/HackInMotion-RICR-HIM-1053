"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Rocket } from "lucide-react";
import events from "@/assets/editorial-events.jpg";
import team from "@/assets/editorial-team.jpg";
import globe from "@/assets/wireframe-globe.png";
import { Reveal, useGsapSetup } from "@/lib/motion-primitives";

export function OrbitSection() {
  const root = useRef<HTMLElement>(null);
  useGsapSetup();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-hover-img]").forEach((wrap) => {
        const img = wrap.querySelector("img");
        if (!img) return;
        const enter = () => gsap.to(img, { scale: 1.08, duration: 0.7, ease: "power3.out" });
        const leave = () => gsap.to(img, { scale: 1, duration: 0.7, ease: "power3.out" });
        wrap.addEventListener("pointerenter", enter);
        wrap.addEventListener("pointerleave", leave);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-white py-16 md:py-24 overflow-hidden w-full">
      {/* Full-width container using full viewport width */}
      <div className="w-full px-3 sm:px-6 md:px-10 lg:px-12 space-y-4 md:space-y-6">
        
        {/* ROW 1: TOP BENTO ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-6 items-stretch">
          
          {/* Card 1: Purple D-Pill (The Latest from our Orbit) */}
          <div className="sm:col-span-6 md:col-span-3">
            <Reveal className="h-full">
              <div className="flex h-full min-h-[260px] md:min-h-[290px] flex-col justify-end bg-purple p-8 sm:p-10 rounded-t-[140px] rounded-b-none border border-black/10">
                <h3 className="display text-3xl sm:text-4xl leading-[1.05] tracking-tight text-black max-w-[10ch]">
                  The Latest from our Orbit
                </h3>
              </div>
            </Reveal>
          </div>

          {/* Card 2: Oval Pill Photo Card (Upcoming Events) */}
          <div className="sm:col-span-6 md:col-span-4">
            <Reveal className="h-full" delay={0.06}>
              <div
                data-hover-img
                className="relative h-full min-h-[260px] md:min-h-[290px] overflow-hidden rounded-[140px] bg-black cursor-pointer group shadow-lg"
              >
                <img
                  src={typeof events === "string" ? events : events.src}
                  alt="Upcoming fintech events"
                  width={960}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <span className="display absolute bottom-8 left-8 text-2xl sm:text-3xl text-white font-bold tracking-tight">
                  Upcoming Events
                </span>
              </div>
            </Reveal>
          </div>

          {/* Card 3: Perfect Circle (Neon Rocket Icon) */}
          <div className="sm:col-span-6 md:col-span-2 flex items-center justify-center">
            <Reveal className="w-full aspect-square max-w-[290px]" delay={0.12}>
              <div className="relative h-full w-full overflow-hidden rounded-full bg-black border border-white/10 flex flex-col items-center justify-center shadow-xl group">
                <div className="size-16 rounded-full bg-pinkish/20 border border-pinkish/40 grid place-items-center text-pinkish transition-transform duration-500 group-hover:scale-110">
                  <Rocket className="size-8 text-pinkish animate-pulse" />
                </div>
                <span className="mt-3 text-xs font-semibold text-white/70 uppercase tracking-widest">
                  Community
                </span>
              </div>
            </Reveal>
          </div>

          {/* Card 4: Tall Vertical Office Team Photo */}
          <div className="sm:col-span-6 md:col-span-3">
            <Reveal className="h-full" delay={0.16}>
              <div
                data-hover-img
                className="relative h-full min-h-[260px] md:min-h-[290px] overflow-hidden rounded-2xl bg-black shadow-lg"
              >
                <img
                  src={typeof team === "string" ? team : team.src}
                  alt="Engineering team at work"
                  width={960}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ROW 2: BOTTOM BENTO ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-6 items-stretch">
          
          {/* Card 5: Massive Hot Coral Pink "100+" Banner with Wireframe Globe */}
          <div className="sm:col-span-12 md:col-span-8 lg:col-span-9">
            <Reveal className="h-full" delay={0.08}>
              <div className="relative flex h-full min-h-[340px] md:min-h-[380px] flex-col justify-between overflow-hidden bg-[#ff3b60] p-8 sm:p-12 rounded-l-none rounded-r-[180px] md:rounded-r-[240px] border border-black/10">
                
                {/* 100+ Huge Text */}
                <div className="relative z-10">
                  <p className="display text-[clamp(4.5rem,13vw,10.5rem)] font-black leading-[0.82] tracking-tighter text-black">
                    100+
                  </p>
                </div>

                {/* Subcopy */}
                <div className="relative z-10 max-w-[28ch]">
                  <p className="text-sm sm:text-base font-semibold leading-[1.4] text-black">
                    PoCs facilitated through the Visa Innovation Program & Koshin FinTech Network
                  </p>
                </div>

                {/* Wireframe 3D Globe Graphic positioned inside on the right */}
                <div className="absolute top-1/2 -right-8 md:right-4 -translate-y-1/2 size-72 sm:size-96 opacity-95 pointer-events-none">
                  <img
                    src={typeof globe === "string" ? globe : globe.src}
                    alt="3D Wireframe Globe"
                    width={800}
                    height={800}
                    className="w-full h-full object-contain animate-spin-slow"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Card 6: Sky Blue Pill Card */}
          <div className="sm:col-span-12 md:col-span-4 lg:col-span-3">
            <Reveal className="h-full" delay={0.14}>
              <div className="flex h-full min-h-[280px] md:min-h-[340px] flex-col justify-end bg-[#70a6ff] p-8 sm:p-10 text-right rounded-t-[120px] rounded-b-none border border-black/10">
                <p className="display text-xl sm:text-2xl font-bold leading-[1.3] text-black max-w-[14ch] ml-auto">
                  One of Denmark's largest AI/FinTech pre-seed networks
                </p>
              </div>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  );
}
