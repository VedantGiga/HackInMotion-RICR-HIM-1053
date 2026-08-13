"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Building2, UploadCloud, CheckCircle2, Lock } from "lucide-react";

export default function AddAccountPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"bank" | "csv" | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation (from 33% to 66%)
      gsap.fromTo(".progress-fill", 
        { width: "33%" }, 
        { width: "66%", duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
      
      // Staggered reveal
      gsap.fromTo(".reveal-elem", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate connection or upload delay
    // Go to targets screen
    setTimeout(() => {
      router.push("/onboarding/targets"); 
    }, 1500);
  };

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-offwhite text-ink overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navigation & Progress */}
      <header className="w-full max-w-4xl mx-auto flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between w-full">
          <Link href="/onboarding/profile" className="text-ink/60 hover:text-ink transition-colors p-1">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink/40">
            Step 2 of 3
          </div>
          <div className="size-5" /> 
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-hairline rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-gradient-to-r from-purple to-cyan w-[33%] rounded-full" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-2">
        <div className="w-full space-y-6 sm:space-y-8">
          
          <div className="text-center space-y-1.5">
            <h1 className="reveal-elem display text-2xl sm:text-3xl font-bold tracking-tight">
              Connect your data
            </h1>
            <p className="reveal-elem text-xs sm:text-sm text-ink/60 max-w-md mx-auto">
              Securely link your accounts or upload a statement to give Koshin's AI the context it needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Connect Bank Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod("bank")}
                className={`reveal-elem group relative flex flex-col items-start p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedMethod === "bank"
                    ? "border-purple bg-purple/5 shadow-md shadow-purple/10"
                    : "border-hairline bg-white hover:border-purple/30 hover:bg-offwhite"
                }`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedMethod === "bank" ? "bg-purple text-white" : "bg-purple/10 text-purple"
                }`}>
                  <Building2 className="size-5" />
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${selectedMethod === "bank" ? "text-ink" : "text-ink/80"}`}>
                  Connect Bank securely
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed mb-4">
                  Uses Plaid to securely connect your bank. Read-only access. We never see your credentials.
                </p>
                <div className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-ink/40">
                  <Lock className="size-3" /> Bank-level encryption
                </div>

                {selectedMethod === "bank" && (
                  <div className="absolute top-4 right-4 text-purple">
                    <CheckCircle2 className="size-5" />
                  </div>
                )}
              </button>

              {/* Upload CSV Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod("csv")}
                className={`reveal-elem group relative flex flex-col items-start p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedMethod === "csv"
                    ? "border-cyan bg-cyan/5 shadow-md shadow-cyan/10"
                    : "border-hairline bg-white hover:border-cyan/30 hover:bg-offwhite"
                }`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedMethod === "csv" ? "bg-cyan text-white" : "bg-cyan/10 text-cyan"
                }`}>
                  <UploadCloud className="size-5" />
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${selectedMethod === "csv" ? "text-ink" : "text-ink/80"}`}>
                  Upload Statement (CSV)
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed mb-4">
                  Manually upload a CSV file from your bank. Perfect for offline analysis or unsupported institutions.
                </p>
                <div className="mt-auto text-[11px] font-bold text-ink/40">
                  Supports .csv, .xls, .xlsx
                </div>

                {selectedMethod === "csv" && (
                  <div className="absolute top-4 right-4 text-cyan">
                    <CheckCircle2 className="size-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="reveal-elem pt-4 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading || !selectedMethod}
                className="w-full max-w-md flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-ink/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {loading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="size-4" />
                  </>
                )}
              </button>
              
              <Link href="/onboarding/targets" className="mt-4 text-xs font-bold text-ink/40 hover:text-ink transition-colors">
                Skip this step for now
              </Link>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
