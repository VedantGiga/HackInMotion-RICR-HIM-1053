"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, CheckCircle2, Sparkles, Eye, EyeOff, Phone } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

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
    <div className="relative min-h-screen bg-offwhite text-ink flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Premium Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-navy p-12 flex-col justify-between overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 size-[400px] bg-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[400px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo and Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-9 w-auto object-contain brightness-0 invert" />
          <span className="display text-2xl font-bold tracking-tight text-white">koshin</span>
        </Link>

        {/* Visual Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-semibold border border-cyan/30">
            <Sparkles className="size-3.5" /> Start Your Journey
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold leading-tight text-white">
            Unlock Financial Clarity.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Join Koshin today to start categorizing expenses, uncovering hidden leaks, and building a healthier financial future.
          </p>

          {/* Floating graphic element */}
          <div className="relative border border-white/10 bg-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md mt-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Account Setup</span>
              <span className="text-[10px] font-semibold text-cyan bg-cyan/10 px-2 py-0.5 rounded-full">Secure</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[33%] bg-gradient-to-r from-purple to-cyan transition-all duration-500" />
            </div>
            <div className="flex justify-between text-xs text-white/70 font-mono">
              <span>Step 1 of 3</span>
              <span>Fast & Encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Koshin Financial Intelligence. Bank-Grade Security.
        </div>
      </div>

      {/* Right Panel: Form container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:w-1/2 bg-white relative overflow-y-auto lg:overflow-visible">
        {/* Back Link and Mobile Logo */}
        <header className="flex items-center justify-between w-full mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-hairline/20"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>

          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-8 w-auto object-contain" />
            <span className="display text-lg font-bold tracking-tight text-ink">koshin</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="my-auto w-full max-w-md mx-auto py-4">
          <div className="space-y-5">
            <div className="text-left space-y-1.5">
              <h1 className="display text-3xl font-bold tracking-tight text-ink">Create Account</h1>
              <p className="text-sm text-muted-foreground">
                Get started for free and optimize your financial health
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl border border-purple/30 bg-purple/10 p-6 text-center space-y-3">
                <CheckCircle2 className="size-10 text-purple mx-auto" />
                <h3 className="text-lg font-bold text-ink">Account Created!</h3>
                <p className="text-xs text-muted-foreground">
                  Welcome to Koshin. Let's set up your personalized engine.
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center w-full rounded-full bg-purple py-3 text-xs font-bold text-white transition-all hover:bg-purple/90 shadow-lg"
                >
                  Start Onboarding Process
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Phone <span className="text-ink/40 font-normal">(Opt)</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-10 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-10 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-ink/60 pl-2 mt-1">
                  Requirements: 8+ chars, 1 number, 1 upper/lowercase
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-hairline bg-offwhite text-purple focus:ring-purple"
                  />
                  <label htmlFor="terms" className="text-xs text-ink/70 leading-relaxed">
                    I agree to Koshin&apos;s{" "}
                    <a href="#" className="text-purple hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreed}
                  className="w-full rounded-full bg-purple py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}

            <div className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-purple hover:underline">
                Sign In Here
              </Link>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-muted-foreground lg:hidden mt-4">
          © {new Date().getFullYear()} Koshin Financial Intelligence.
        </footer>
      </div>
    </div>
  );
}
