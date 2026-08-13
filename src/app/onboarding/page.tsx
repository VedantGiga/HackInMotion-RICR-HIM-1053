"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function OnboardingWelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow pulse
      gsap.to(".glow-blob", {
        scale: 1.1,
        opacity: 0.8,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 1,
      });

      // Staggered reveal for main content
      gsap.fromTo(".reveal-elem", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
      
      // Floating feature cards
      gsap.to(".float-card", {
        y: -10,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.4,
        delay: 1.5 // start floating after reveal
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-offwhite text-ink overflow-hidden flex flex-col items-center justify-between p-6 sm:p-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="glow-blob absolute top-[10%] left-[20%] size-[400px] bg-purple/10 rounded-full blur-[120px]" />
        <div className="glow-blob absolute bottom-[10%] right-[20%] size-[400px] bg-cyan/10 rounded-full blur-[120px]" />
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Badge */}
        <div className="reveal-elem inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hairline shadow-sm mb-4 sm:mb-6">
          <Sparkles className="size-4 text-purple" />
          <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Welcome to Koshin</span>
        </div>

        {/* Hero Title */}
        <h1 className="reveal-elem display text-4xl sm:text-6xl font-bold tracking-tight mb-4 leading-tight">
          Financial Intelligence,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-cyan">Unlocked.</span>
        </h1>
        
        {/* Hero Description */}
        <p className="reveal-elem text-sm sm:text-base text-ink/60 max-w-xl mb-6 sm:mb-8">
          Let's set up your personalized engine. We'll organize your accounts, uncover hidden leaks, and build a healthier financial future.
        </p>

        {/* Feature Cards */}
        <div className="reveal-elem grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6 sm:mb-8">
          {[
            { icon: Shield, title: "Bank-Grade Security", desc: "AES-256 encryption ensures your data remains completely private and secure." },
            { icon: Zap, title: "AI Categorization", desc: "Our intelligent algorithms automatically sort and organize your spending patterns." },
            { icon: Sparkles, title: "Actionable Insights", desc: "Receive real-time feedback and dynamic scoring on your financial health." }
          ].map((feature, i) => (
            <div key={i} className="float-card bg-white p-4 sm:p-5 rounded-2xl border border-hairline shadow-sm text-left">
              <div className="size-10 rounded-xl bg-purple/10 flex items-center justify-center mb-3">
                <feature.icon className="size-5 text-purple" />
              </div>
              <h3 className="text-sm font-bold text-ink mb-1">{feature.title}</h3>
              <p className="text-xs text-ink/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="reveal-elem flex flex-col items-center">
          <Link 
            href="/onboarding/profile"
            className="group relative inline-flex items-center justify-center gap-3 bg-ink text-white px-8 py-3.5 rounded-full font-bold text-base overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-ink/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Start Setup</span>
            <ArrowRight className="relative z-10 size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[11px] font-medium text-ink/40 mt-2">Takes less than 2 minutes.</p>
        </div>
      </div>
    </div>
  );
}
