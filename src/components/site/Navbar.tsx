"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { logOut } from "@/lib/firebase/auth";
import gsap from "gsap";

const LINKS = [
  { label: "Problem & Vision", href: "/#problem" },
  { label: "Auto Categorization", href: "/#categorization" },
  { label: "Health Score", href: "/#health" },
  { label: "Features", href: "/#features" },
];

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isDashboard = pathname === "/dashboard";
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

      if (nearFooter && !isDashboard) {
        setVisible(false);
      } else if (currentScrollY <= 15) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboard]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-logo]",
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );
      if (!isDashboard) {
        gsap.fromTo(
          "[data-nav-item]",
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, delay: 0.15, ease: "power3.out" },
        );
      }
    });
    return () => ctx.revert();
  }, [isDashboard]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 top-3 sm:top-4 z-50 px-2.5 sm:px-6 pointer-events-none">
        <header
          className={`pointer-events-auto max-w-6xl mx-auto rounded-2xl border transition-all duration-500 transform ${
            !visible
              ? "-translate-y-28 opacity-0"
              : "translate-y-0 opacity-100 " +
                (isDashboard
                  ? "border-white/10 bg-navy/90 backdrop-blur-xl shadow-2xl text-white"
                  : scrolled
                  ? "border-hairline bg-white/90 backdrop-blur-xl shadow-xl shadow-black/5"
                  : "border-hairline/60 bg-white/80 backdrop-blur-lg shadow-md shadow-black/5")
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-2.5 px-3 sm:px-7">
            <a href={isDashboard ? "/" : "#top"} data-nav-logo className="relative inline-flex items-center group shrink-0">
              <img 
                src="/logofinal-bgremoved.png" 
                alt="Koshin logo" 
                className={`h-10 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${isDashboard ? "brightness-0 invert" : ""}`} 
              />
            </a>

            {!isDashboard && (
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
            )}

            {/* Auth Buttons + Mobile Hamburger Menu */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {isDashboard ? (
                <button
                  onClick={async () => {
                    if (typeof window !== "undefined") {
                      localStorage.clear();
                      sessionStorage.clear();
                    }
                    await logOut();
                    window.location.href = "/login";
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white transition-all hover:bg-white/10 cursor-pointer"
                >
                  Sign Out
                </button>
              ) : isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-purple px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white transition-transform hover:scale-[1.02] shadow-xs"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-transparent px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-ink transition-all hover:border-ink hover:bg-ink/5"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-ink px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-background transition-transform hover:scale-[1.02] shadow-xs"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {!isDashboard && (
                <motion.button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setOpen(true)}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ rotate: -3 }}
                  className="grid size-8.5 sm:size-10 shrink-0 place-items-center rounded-xl bg-purple text-ink lg:hidden ml-0.5"
                >
                  <span className="flex flex-col gap-[4px]">
                    <span className="block h-[2px] w-4 bg-ink" />
                    <span className="block h-[2px] w-4 bg-ink" />
                    <span className="block h-[2px] w-4 bg-ink" />
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {open && !isDashboard && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-ink text-background flex flex-col justify-between p-6 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between py-2 border-b border-white/10 pb-4">
                <img src="/logofinal-bgremoved.png" alt="Koshin logo" className="h-10 w-auto object-contain brightness-0 invert" />

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-xl bg-purple text-ink"
                >
                  <span className="relative block size-5">
                    <span className="absolute top-1/2 left-0 h-[2px] w-5 rotate-45 bg-ink" />
                    <span className="absolute top-1/2 left-0 h-[2px] w-5 -rotate-45 bg-ink" />
                  </span>
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                    className="display border-b border-white/10 py-3.5 text-2xl sm:text-3xl text-white hover:text-purple transition-colors"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
