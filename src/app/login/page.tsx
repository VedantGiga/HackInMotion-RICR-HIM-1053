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
    <div className="relative min-h-screen bg-offwhite text-ink flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Premium Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-navy p-12 flex-col justify-between overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 size-[400px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[400px] bg-pinkish/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo and Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-9 w-auto object-contain brightness-0 invert" />
          <span className="display text-2xl font-bold tracking-tight text-white">koshin</span>
        </Link>

        {/* Visual Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/20 text-purple text-xs font-semibold border border-purple/30">
            <Sparkles className="size-3.5" /> Financial Intelligence Platform
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold leading-tight text-white">
            Smart Financial Intelligence.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Automated transaction categorization, instant financial health scores, and premium automated tracking that keeps you ahead of your subscriptions.
          </p>

          {/* Floating graphic element */}
          <div className="relative border border-white/10 bg-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md mt-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Health Score Analysis</span>
              <span className="text-[10px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full">Good & Healthy</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[78%] bg-gradient-to-r from-purple to-cyan transition-all duration-500" />
            </div>
            <div className="flex justify-between text-xs text-white/70 font-mono">
              <span>78 / 100</span>
              <span>18.4% average savings</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Koshin Financial Intelligence. Bank-Grade Security.
        </div>
      </div>

      {/* Right Panel: Form container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-16 lg:w-1/2 bg-white relative">
        {/* Back Link and Mobile Logo */}
        <header className="flex items-center justify-between w-full mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-hairline/20"
          >
            <ArrowLeft className="size-3.5" /> Back
          </Link>

          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-8 w-auto object-contain" />
            <span className="display text-lg font-bold tracking-tight text-ink">koshin</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="my-auto w-full max-w-md mx-auto py-6">
          <div className="space-y-6">
            <div className="text-left space-y-2">
              <h1 className="display text-3xl font-bold tracking-tight text-ink">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to inspect your financial health dashboard
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl border border-purple/30 bg-purple/10 p-6 text-center space-y-3">
                <CheckCircle2 className="size-10 text-purple mx-auto" />
                <h3 className="text-lg font-bold text-ink">Authentication Successful!</h3>
                <p className="text-xs text-muted-foreground">
                  Redirecting to your personalized Koshin Intelligence Dashboard...
                </p>
                <Link
                  href="/#demo"
                  className="inline-flex items-center justify-center w-full rounded-full bg-purple py-3 text-xs font-bold text-white transition-all hover:bg-purple/90 shadow-lg"
                >
                  Go to Live Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-full border border-hairline bg-offwhite py-3 pr-4 pl-11 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-ink/80">Password</label>
                    <a href="#" className="text-xs text-purple hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-full border border-hairline bg-offwhite py-3 pr-11 pl-11 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-purple py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
                >
                  {loading ? "Authenticating..." : "Sign In to Koshin"}
                </button>

                <div className="relative my-4 text-center text-xs text-ink/40">
                  <span className="bg-white px-3 relative z-10">or explore demo</span>
                  <div className="absolute inset-x-0 top-1/2 h-px bg-hairline" />
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full rounded-full border border-hairline bg-offwhite py-3 text-xs font-semibold text-ink transition-all hover:bg-hairline/50"
                >
                  1-Click Demo Login (Alex Demo)
                </button>
              </form>
            )}

            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="font-semibold text-purple hover:underline">
                Create an Account
              </Link>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-muted-foreground lg:hidden mt-8">
          © {new Date().getFullYear()} Koshin Financial Intelligence.
        </footer>
      </div>
    </div>
  );
}
