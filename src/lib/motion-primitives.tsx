import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function useGsapSetup() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function prefersReduced() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reveals children line-by-line / element-by-element on scroll. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "p" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapSetup();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap.fromTo(
            el,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration: 1, delay, ease: "power3.out" },
          );
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/** Slide in from right for metrics numbers. */
export function SlideInFromRight({
  children,
  className = "",
  delay = 0,
  x = 120,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapSetup();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1, x: 0 });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap.fromTo(
            el,
            { opacity: 0, x },
            { opacity: 1, x: 0, duration: 1.2, delay, ease: "power4.out" },
          );
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, x]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

/** Heading reveal: each line masked, translateY(100%) -> 0 */
export function LineReveal({
  lines,
  className = "",
  lineClassName = "",
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapSetup();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll<HTMLElement>("[data-line-inner]");
    if (prefersReduced()) {
      gsap.set(inner, { yPercent: 0 });
      return;
    }
    gsap.set(inner, { yPercent: 110 });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap.to(inner, { yPercent: 0, duration: 1.15, ease: "expo.out", stagger });
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {lines.map((l) => (
        <span key={l} className="line-mask">
          <span data-line-inner className={`block will-change-transform ${lineClassName}`}>
            {l}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Subtle pointer parallax for 3D visuals. */
export function usePointerParallax(strength = 18) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 1.4, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * strength);
      yTo(ny * strength);
      rTo(nx * strength * 0.12);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength]);
  return ref;
}

/** Scroll parallax on Y for layered elements. */
export function useScrollParallax(distance = 80) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapSetup();
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: distance / 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [distance]);
  return ref;
}
