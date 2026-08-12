"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";

const LINKS = [
  { label: "Problem & Vision", href: "#problem" },
  { label: "Auto Categorization", href: "#categorization" },
  { label: "Health Score", href: "#health" },
  { label: "Features", href: "#features" },
  { label: "Live Dashboard", href: "#demo" },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const nearFooter = currentScrollY + clientHeight >= scrollHeight - 450;

      setScrolled(currentScrollY > 15);

      if (nearFooter) {
        // Reached footer -> hide top navbar so logo smoothly slides into footer position
        setVisible(false);
      } else if (currentScrollY <= 15) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll DOWN -> hide navbar
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll UP -> show navbar!
        setVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-logo]",
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        "[data-nav-item]",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, delay: 0.15, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 transform ${
          !visible
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 " +
              (scrolled
                ? "border-b border-hairline bg-background/90 backdrop-blur-md shadow-sm"
                : "bg-transparent")
        }`}
      >
        <div className="shell flex items-center justify-between gap-6 py-2.5 sm:py-3">
          <a href="#top" data-nav-logo className="relative inline-flex items-center group">
            <img src="/logofinal-bgremoved.png" alt="Koshin logo" className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                data-nav-item
                href={l.href}
                className="group relative text-[14px] font-medium text-ink transition-opacity hover:opacity-70"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-transparent px-4 py-2 text-xs font-semibold text-ink transition-all hover:border-ink hover:bg-ink/5"
            >
              Sign In
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.02] shadow-sm"
            >
              Open Live Dashboard
            </a>
          </div>

          <motion.button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ rotate: -3 }}
            className="grid size-10 shrink-0 place-items-center bg-purple lg:hidden"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-5 bg-ink" />
              <span className="block h-[2px] w-5 bg-ink" />
              <span className="block h-[2px] w-5 bg-ink" />
            </span>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-ink text-background"
          >
            <div className="shell flex items-center justify-between py-5">
              <div className="flex items-center gap-3">
                <img src="/logofinal-bgremoved.png" alt="Koshin logo" className="h-8 w-auto object-contain brightness-0 invert" />

              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center bg-purple text-ink"
              >
                <span className="relative block size-5">
                  <span className="absolute top-1/2 left-0 h-[2px] w-5 rotate-45 bg-ink" />
                  <span className="absolute top-1/2 left-0 h-[2px] w-5 -rotate-45 bg-ink" />
                </span>
              </button>
            </div>
            <nav className="shell mt-10 flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="display border-b border-white/10 py-4 text-4xl sm:text-5xl"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

