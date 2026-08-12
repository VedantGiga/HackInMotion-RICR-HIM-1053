"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ProcessingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Establishing secure connection...",
    "Importing raw transaction data...",
    "Normalizing merchants and dates...",
    "Running AI categorization engine...",
    "Generating financial health score...",
    "Finalizing your dashboard..."
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation (from 66% to 100%)
      gsap.fromTo(".progress-fill", 
        { width: "66%" }, 
        { width: "100%", duration: 2, ease: "power2.out", delay: 0.5 }
      );
      
      // Initial fade in for the minimal center container
      gsap.fromTo(".center-container",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
    }, containerRef);

    // Simulate progress through the steps
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < steps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        // Add a slight delay before redirecting to the dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    }, 1800); // 1.8 seconds per step

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [router]);

  // Animate the text change
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(".step-text", 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentStep]);

  const isComplete = currentStep >= steps.length;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-offwhite text-ink flex flex-col font-sans">
      {/* Minimal Top Nav (no back button during processing) */}
      <header className="w-full p-6 lg:px-12 flex flex-col gap-4">
        <div className="flex items-center justify-center w-full max-w-5xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
            Step 3 of 3 • Finalizing
          </div>
        </div>
        <div className="w-full max-w-md mx-auto h-1 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-[66%] rounded-full" />
        </div>
      </header>

      {/* Main Content - Minimalist Center */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto text-center">
        <div className="center-container flex flex-col items-center justify-center w-full aspect-square max-w-[320px] mx-auto relative">
          
          {/* Subtle background pulse */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple/5 to-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Icon state */}
          <div className="relative z-10 mb-8 flex items-center justify-center">
            {isComplete ? (
              <div className="size-16 rounded-full bg-ink flex items-center justify-center text-white shadow-xl shadow-ink/20">
                <CheckCircle2 className="size-8" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center size-16">
                <Loader2 className="size-8 text-ink animate-spin" />
                <div className="absolute inset-0 border-2 border-dashed border-ink/20 rounded-full animate-[spin_3s_linear_reverse]" />
              </div>
            )}
          </div>

          {/* Dynamic text */}
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-2">
            {isComplete ? "Setup Complete" : "Analyzing Data"}
          </h2>
          
          <div className="h-6 relative w-full flex justify-center">
            <p className="step-text text-sm text-ink/50 absolute">
              {isComplete ? "Redirecting to your dashboard..." : steps[Math.min(currentStep, steps.length - 1)]}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
