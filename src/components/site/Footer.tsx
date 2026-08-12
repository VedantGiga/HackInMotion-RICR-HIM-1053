"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const NAV = ["Problem & Vision", "Auto Categorization", "Health Score", "Features", "Live Dashboard"];
const LEGAL = ["Privacy & Security", "NLP Engine Specs", "API Docs", "Terms of Service"];

export function Footer() {
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const tagTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = logoBoxRef.current;
    const img = logoImgRef.current;
    const text = tagTextRef.current;
    if (!box || !img || !text) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              img,
              { y: -70, opacity: 0, scale: 0.85 },
              { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
            );
            gsap.fromTo(
              text,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.25, ease: "power3.out" }
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-white text-ink pt-16 md:pt-24 pb-0 overflow-hidden flex flex-col justify-between">
      <div className="shell space-y-16">

        {/* SURROUNDING FOOTER GRID: NAV & DESCRIPTION FLANKING THE CENTRAL ANIMATED LOGO */}
        <div ref={logoBoxRef} className="grid gap-12 grid-cols-1 md:grid-cols-12 items-center pb-12">

          {/* LEFT SIDE: Platform & Legal Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            {/* Platform Column */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-ink uppercase tracking-widest">Platform</h4>
              <nav className="flex flex-col gap-2">
                {NAV.map((n) => (
                  <a
                    key={n}
                    href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-ink font-medium"
                  >
                    {n}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal & Security Column */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-ink uppercase tracking-widest">Legal & Security</h4>
              <nav className="flex flex-col gap-2">
                {LEGAL.map((n) => (
                  <a
                    key={n}
                    href="#demo"
                    className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-ink font-medium"
                  >
                    {n}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* CENTER: FEATURED LOGO & TAGLINE (GSAP Animated Slide-In) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2 space-y-4 my-4 md:my-0">
            <a href="#top" className="group inline-block">
              <img
                ref={logoImgRef}
                src="/logofinal-bgremoved.png"
                alt="Koshin Logo"
                className="h-28 sm:h-36 md:h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </a>

            <div ref={tagTextRef} className="space-y-1.5">
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-[1.6]">
                &quot;Because you can&apos;t fix what you can&apos;t see.&quot;
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Financial Intelligence Summary & Action Buttons */}
          <div className="md:col-span-4 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-widest">Financial Intelligence</h4>
              <p className="text-xs sm:text-sm leading-[1.7] text-muted-foreground">
                Koshin turns raw bank transactions into clean categories, silent bill alerts, and plain-language advisor insights with bank-grade security.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#demo"
                className="inline-flex items-center justify-between gap-3 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple hover:text-ink shadow-md"
              >
                <span>Launch Dashboard</span>
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-2.5 text-xs font-semibold text-ink transition-all hover:border-ink hover:bg-ink/5"
              >
                Sign In
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-hairline pt-8 text-xs text-muted-foreground gap-4">
          <span>© {new Date().getFullYear()} Koshin Financial Intelligence. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-purple" />
            <span>Bank-Grade 256-Bit Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
