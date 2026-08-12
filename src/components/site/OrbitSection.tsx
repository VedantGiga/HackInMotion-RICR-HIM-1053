import { useEffect, useRef } from "react";
import gsap from "gsap";
import events from "@/assets/editorial-events.jpg";
import team from "@/assets/editorial-team.jpg";
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
        const enter = () => gsap.to(img, { scale: 1.07, duration: 0.7, ease: "power3.out" });
        const leave = () => gsap.to(img, { scale: 1, duration: 0.7, ease: "power3.out" });
        wrap.addEventListener("pointerenter", enter);
        wrap.addEventListener("pointerleave", leave);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="border-t border-hairline py-24 md:py-32 lg:py-40">
      <div className="shell grid gap-4 md:grid-cols-4">
        <Reveal className="md:col-span-1">
          <div className="flex h-full min-h-[220px] items-center bg-mint p-8 rounded-r-full">
            <h3 className="display max-w-[8ch] text-3xl text-ink">The Latest from our Orbit</h3>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.06}>
          <div data-hover-img className="relative h-full min-h-[220px] overflow-hidden">
            <img
              src={events}
              alt="MatrixPay upcoming fintech events"
              width={960}
              height={640}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="display absolute bottom-6 left-6 text-2xl text-white">
              Upcoming Events
            </span>
          </div>
        </Reveal>

        <Reveal className="md:col-span-1" delay={0.12}>
          <div
            data-hover-img
            className="relative h-full min-h-[220px] overflow-hidden rounded-full bg-ink"
          >
            <img
              src={team}
              alt="MatrixPay engineering community"
              width={960}
              height={640}
              loading="lazy"
              className="h-full w-full object-cover opacity-80"
            />
            <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">
              Community
            </span>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.06}>
          <div className="flex h-full min-h-[300px] flex-col justify-between bg-pinkish p-8 rounded-r-[999px] md:min-h-[380px]">
            <p className="display text-[clamp(4rem,11vw,9rem)] leading-[0.85] text-ink">100+</p>
            <p className="max-w-[26ch] text-[15px] leading-[1.6] text-ink">
              PoCs facilitated through the Visa Innovation Program Europe
            </p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-1" delay={0.1}>
          <div data-hover-img className="h-full min-h-[220px] overflow-hidden">
            <img
              src={team}
              alt="MatrixPay insights"
              width={960}
              height={640}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="md:col-span-1" delay={0.14}>
          <div className="flex h-full min-h-[220px] items-end bg-skyblue p-8 text-right rounded-l-full">
            <p className="display ml-auto max-w-[10ch] text-2xl text-ink">
              Insights from Europe&apos;s payment rails
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
