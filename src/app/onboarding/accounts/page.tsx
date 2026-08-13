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
    <div ref={containerRef} className="relative min-h-screen bg-offwhite text-ink flex flex-col">
      {/* Top Navigation & Progress */}
      <header className="w-full p-6 lg:px-12 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <Link href="/onboarding/profile" className="text-ink/60 hover:text-ink transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-3">
            <h1 className="reveal-elem display text-3xl md:text-4xl font-bold tracking-tight">
              Connect your data
            </h1>
            <p className="reveal-elem text-sm md:text-base text-ink/60 max-w-lg mx-auto">
              Securely link your accounts or upload a statement to give Koshin's AI the context it needs to analyze your financial health.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Connect Bank Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod("bank")}
                className={`reveal-elem group relative flex flex-col items-start p-8 rounded-3xl border text-left transition-all duration-300 ${
                  selectedMethod === "bank"
                    ? "border-purple bg-purple/5 shadow-lg shadow-purple/10"
                    : "border-hairline bg-white hover:border-purple/30 hover:bg-offwhite"
                }`}
              >
                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedMethod === "bank" ? "bg-purple text-white" : "bg-purple/10 text-purple"
                }`}>
                  <Building2 className="size-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${selectedMethod === "bank" ? "text-ink" : "text-ink/80"}`}>
                  Connect Bank securely
                </h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-6">
                  Uses Plaid to securely connect your bank. Read-only access. We never see your credentials.
                </p>
                <div className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-ink/40">
                  <Lock className="size-3" /> Bank-level encryption
                </div>

                {selectedMethod === "bank" && (
                  <div className="absolute top-6 right-6 text-purple">
                    <CheckCircle2 className="size-6" />
                  </div>
                )}
              </button>

              {/* Upload CSV Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod("csv")}
                className={`reveal-elem group relative flex flex-col items-start p-8 rounded-3xl border text-left transition-all duration-300 ${
                  selectedMethod === "csv"
                    ? "border-cyan bg-cyan/5 shadow-lg shadow-cyan/10"
                    : "border-hairline bg-white hover:border-cyan/30 hover:bg-offwhite"
                }`}
              >
                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedMethod === "csv" ? "bg-cyan text-white" : "bg-cyan/10 text-cyan"
                }`}>
                  <UploadCloud className="size-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${selectedMethod === "csv" ? "text-ink" : "text-ink/80"}`}>
                  Upload Statement (CSV)
                </h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-6">
                  Manually upload a CSV file from your bank. Perfect for offline analysis or unsupported institutions.
                </p>
                <div className="mt-auto text-xs font-bold text-ink/40">
                  Supports .csv, .xls, .xlsx
                </div>

                {selectedMethod === "csv" && (
                  <div className="absolute top-6 right-6 text-cyan">
                    <CheckCircle2 className="size-6" />
                  </div>
                )}
              </button>
            </div>

            <div className="reveal-elem pt-8 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading || !selectedMethod}
                className="w-full max-w-md flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-ink/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="size-4" />
                  </>
                )}
              </button>
              
              <Link href="/onboarding/targets" className="mt-6 text-xs font-bold text-ink/40 hover:text-ink transition-colors">
                Skip this step for now
              </Link>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
