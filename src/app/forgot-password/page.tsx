"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { resetPassword } from "@/lib/firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
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
            <ShieldCheck className="size-3.5" /> Secure Recovery
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold leading-tight text-white">
            Regain Access Safely.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            We use AES-256 encryption and advanced security protocols to ensure your financial data remains completely protected during account recovery.
          </p>

          {/* Floating graphic element */}
          <div className="relative border border-white/10 bg-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md mt-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Security Status</span>
              <span className="text-[10px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full">Encrypted Link</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full w-full bg-gradient-to-r from-purple to-cyan opacity-50" />
            </div>
            <div className="flex justify-between text-xs text-white/70 font-mono">
              <span>Identity Verification</span>
              <span>100% Secure</span>
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
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-hairline/20"
          >
            <ArrowLeft className="size-3.5" /> Back to Login
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
              <h1 className="display text-3xl font-bold tracking-tight text-ink">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl border border-purple/30 bg-purple/10 p-6 text-center space-y-3">
                <CheckCircle2 className="size-10 text-purple mx-auto" />
                <h3 className="text-lg font-bold text-ink">Recovery Link Sent!</h3>
                <p className="text-xs text-muted-foreground">
                  If an account exists for that email, we've sent a secure reset link. Please check your inbox and spam folder.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full rounded-full border border-purple bg-transparent py-3 text-xs font-bold text-purple transition-all hover:bg-purple/10 mt-2"
                >
                  Return to Login
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

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full rounded-full bg-purple py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
                >
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="text-center text-xs text-muted-foreground mt-8">
              Need help?{" "}
              <a href="#" className="font-semibold text-purple hover:underline">
                Contact Support
              </a>
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
