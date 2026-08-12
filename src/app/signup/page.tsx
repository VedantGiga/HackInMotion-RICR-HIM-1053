"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, User, CheckCircle2, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-navy text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 size-[500px] bg-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 size-[500px] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/10"
        >
          <ArrowLeft className="size-3.5" /> Back to Koshin
        </Link>

        <Link href="/" className="flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-9 w-auto object-contain" />
          <span className="display text-xl font-bold tracking-tight text-white">koshin</span>
        </Link>
      </header>

      {/* Main SignUp Card */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto py-12">
        <div className="rounded-3xl border border-white/15 bg-black/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-semibold border border-cyan/30 mb-2">
              <Sparkles className="size-3" /> Get Started Free
            </div>
            <h1 className="display text-3xl font-bold tracking-tight text-white">Create Account</h1>
            <p className="text-sm text-white/60">
              Start categorizing expenses and uncovering hidden leaks
            </p>
          </div>

          {success ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
              <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Account Created!</h3>
              <p className="text-xs text-emerald-200">
                Welcome to Koshin. Your financial health workspace is ready.
              </p>
              <Link
                href="/#demo"
                className="inline-flex items-center justify-center w-full rounded-full bg-lime py-3 text-xs font-bold text-ink transition-all hover:bg-lime/90 shadow-lg"
              >
                Launch Intelligence Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 pr-4 pl-11 text-sm text-white placeholder-white/40 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Work or Personal Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 pr-4 pl-11 text-sm text-white placeholder-white/40 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password (min 8 chars)"
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 pr-11 pl-11 text-sm text-white placeholder-white/40 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="size-4 rounded border-white/20 bg-white/5 text-lime focus:ring-lime"
                />
                <label htmlFor="terms" className="text-xs text-white/70">
                  I agree to Koshin&apos;s{" "}
                  <a href="#" className="text-lime underline">
                    Terms of Service
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-lime underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full rounded-full bg-lime py-3.5 text-sm font-bold text-ink shadow-lg transition-all hover:bg-lime/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-lime hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Koshin Financial Intelligence. Bank-Grade Security.
      </footer>
    </div>
  );
}
