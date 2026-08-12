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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          scrolled ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100 bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-6 py-5">
          <a href="#top" data-nav-logo className="relative inline-flex items-center gap-2">
            <span className="display text-2xl tracking-[-0.05em] text-ink">koshin.</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime/20 text-ink text-[10px] font-semibold tracking-wide border border-lime/40">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Financial Health AI
            </span>
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
              href="#demo"
              className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.02]"
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
            className="grid size-10 shrink-0 place-items-center bg-lime lg:hidden"
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
              <span className="display text-2xl tracking-[-0.05em]">koshin.</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center bg-lime text-ink"
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

