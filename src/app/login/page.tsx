"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const verified = params.get("verified");
      if (email) setValue("email", email);
      if (verified === "true") setVerifiedSuccess(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError("");
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res || res.error || !res.ok) {
        setAuthError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("koshin_onboarded", "true");
        localStorage.setItem("koshin_login_bypass", "true");
      }
      setRedirecting(true);
      router.push("/dashboard");
    } catch (err: any) {
      setAuthError(err.message || "Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login removed as requested
  };

  return (
    <div className="relative min-h-screen bg-offwhite text-ink flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Premium Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-[url('/bgimage.png')] bg-cover bg-center p-12 flex-col justify-between overflow-hidden">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-navy/85 backdrop-blur-[2px] pointer-events-none" />

        {/* Glow effects */}
        <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-purple/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-cyan/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] bg-brandblue/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Decorative grid dots */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo and Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-32 w-auto object-contain brightness-0 invert scale-110 origin-left" />
        </Link>

        {/* Visual Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/20 text-purple text-xs font-semibold border border-purple/30">
            <Sparkles className="size-3.5" /> Financial Intelligence Platform
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold leading-tight text-white">
            Smart Financial<br />Intelligence.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-md">
            Automated transaction categorization, instant financial health scores, and premium automated tracking that keeps you ahead of your subscriptions.
          </p>

          {/* Floating decorative squares */}
          <div className="flex items-center gap-3 pt-4" aria-hidden>
            <span className="size-3 bg-purple rounded-sm" />
            <span className="size-3 bg-cyan rounded-sm" />
            <span className="size-3 bg-brandblue rounded-sm" />
            <span className="h-px flex-1 bg-white/10" />
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
            <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-24 w-auto object-contain" />
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
                {verifiedSuccess && (
                  <div className="flex items-center gap-2 p-3.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl font-semibold">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    <span>Email verified successfully! Please enter your password to log in.</span>
                  </div>
                )}
                {authError && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="name@company.com"
                      className="w-full rounded-full border border-hairline bg-offwhite py-3 pr-4 pl-11 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      suppressHydrationWarning
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 pl-2 mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-ink/80">Password</label>
                    <Link href="/forgot-password" className="text-xs text-purple hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••••••"
                      className="w-full rounded-full border border-hairline bg-offwhite py-3 pr-11 pl-11 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink focus:outline-none"
                      suppressHydrationWarning
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 pl-2 mt-1">{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full rounded-full bg-purple py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
                  suppressHydrationWarning
                >
                  {redirecting ? "Redirecting to Dashboard..." : loading ? "Authenticating..." : "Sign In to Koshin"}
                </button>

              </form>

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
