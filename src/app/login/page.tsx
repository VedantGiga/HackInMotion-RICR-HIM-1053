"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail("alex.demo@koshin.ai");
    setPassword("••••••••••••");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-navy text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 size-[500px] bg-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-[500px] bg-pinkish/10 rounded-full blur-[140px] pointer-events-none" />

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

      {/* Main Login Card */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto py-12">
        <div className="rounded-3xl border border-white/15 bg-black/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/20 text-purple text-xs font-semibold border border-purple/30 mb-2">
              <Sparkles className="size-3" /> Financial Intelligence Platform
            </div>
            <h1 className="display text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-sm text-white/60">
              Sign in to inspect your financial health dashboard
            </p>
          </div>

          {success ? (
            <div className="rounded-2xl border border-purple/30 bg-purple/10 p-6 text-center space-y-3">
              <CheckCircle2 className="size-10 text-purple mx-auto" />
              <h3 className="text-lg font-bold text-white">Authentication Successful!</h3>
              <p className="text-xs text-purple/85">
                Redirecting to your personalized Koshin Intelligence Dashboard...
              </p>
              <Link
                href="/#demo"
                className="inline-flex items-center justify-center w-full rounded-full bg-purple py-3 text-xs font-bold text-ink transition-all hover:bg-purple/90 shadow-lg"
              >
                Go to Live Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 pr-4 pl-11 text-sm text-white placeholder-white/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/80">Password</label>
                  <a href="#" className="text-xs text-purple hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 pr-11 pl-11 text-sm text-white placeholder-white/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-purple py-3.5 text-sm font-bold text-ink shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Sign In to Koshin"}
              </button>

              <div className="relative my-4 text-center text-xs text-white/40">
                <span className="bg-navy px-3 relative z-10">or explore demo</span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full rounded-full border border-white/25 bg-white/5 py-3 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
              >
                1-Click Demo Login (Alex Demo)
              </button>
            </form>
          )}

          <div className="text-center text-xs text-white/60">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="font-semibold text-purple hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Koshin Financial Intelligence. Encrypted & Secure.
      </footer>
    </div>
  );
}
