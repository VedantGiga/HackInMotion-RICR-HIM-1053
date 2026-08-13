"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be exactly 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  // Focus management for the 6 individual inputs
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);
    setValue("code", newDigits.join(''), { shouldValidate: true });

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && codeDigits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setCodeDigits(newDigits);
      setValue("code", newDigits.join(''), { shouldValidate: true });
      if (pastedData.length === 6) {
        inputRefs.current[5]?.focus();
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  const onSubmit = async (data: VerifyFormValues) => {
    setAuthError("");
    setLoading(true);
    
    try {
      // Simulate API call for verification
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // If we had a real endpoint:
      // const res = await fetch("/api/v1/auth/verify", { ... });
      // if (!res.ok) throw new Error("Invalid verification code");
      
      setRedirecting(true);
      router.push("/onboarding");
    } catch (err: any) {
      setAuthError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-ink flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Premium Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-navy p-12 flex-col justify-between overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 size-[400px] bg-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[400px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo and Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-20 w-auto object-contain brightness-0 invert" />
        </Link>

        {/* Visual Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-semibold border border-cyan/30">
            <ShieldCheck className="size-3.5" /> Secure Account
          </div>
          <h1 className="display text-4xl md:text-5xl font-bold text-white leading-tight">
            Protecting your financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-brandblue">data footprint.</span>
          </h1>
          <p className="text-grayed text-lg leading-relaxed">
            We use bank-level encryption and strict identity verification to ensure your data stays exclusively in your control.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-grayed text-sm flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Koshin AI.</span>
          <span className="w-1 h-1 rounded-full bg-grayed opacity-50" />
          <span>Bank-level security</span>
        </div>
      </div>

      {/* Right Panel: Verification Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative py-12">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden absolute top-8 left-6 sm:left-12 flex items-center gap-2">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-10 w-auto object-contain" />
        </Link>

        <div className="max-w-md w-full mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="size-16 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-6">
              <Mail className="size-8 text-cyan-600" />
            </div>
            <h2 className="display text-3xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground text-sm font-medium">
              We&apos;ve sent a 6-digit verification code to your email. Enter it below to verify your identity.
            </p>
          </motion.div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-pinkish/10 border border-pinkish/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="size-5 text-pinkish shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-pinkish-700">{authError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              <label className="block text-sm font-bold text-ink">Verification Code</label>
              <div className="flex gap-3 sm:gap-4 justify-between" onPaste={handlePaste}>
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-offwhite border focus:outline-none focus:ring-2 focus:ring-cyan focus:bg-white transition-all shadow-sm ${
                      errors.code ? 'border-pinkish focus:border-pinkish focus:ring-pinkish' : 'border-hairline hover:border-gray-300'
                    }`}
                  />
                ))}
              </div>
              {errors.code && (
                <p className="text-xs font-bold text-pinkish mt-2 flex items-center gap-1.5">
                  <AlertCircle className="size-3.5" /> {errors.code.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button
                type="submit"
                disabled={loading || redirecting || codeDigits.some(d => d === '')}
                className="w-full py-4 bg-ink hover:bg-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {redirecting ? (
                  <>
                    <Sparkles className="size-5 animate-pulse" />
                    Verified! Redirecting...
                  </>
                ) : loading ? (
                  <>
                    <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center text-sm font-semibold text-muted-foreground"
          >
            Didn&apos;t receive the code?{" "}
            <button className="text-cyan-700 hover:text-cyan font-bold transition-colors">
              Click to resend
            </button>
          </motion.div>
        </div>

        {/* Back navigation */}
        <Link href="/signup" className="absolute top-8 right-6 sm:right-12 p-2 rounded-lg hover:bg-offwhite text-muted-foreground hover:text-ink transition-all flex items-center gap-2 text-sm font-bold">
          <ArrowLeft className="size-4" /> Change Email
        </Link>
      </div>
    </div>
  );
}
