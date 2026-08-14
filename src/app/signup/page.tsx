"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, CheckCircle2, Sparkles, Eye, EyeOff, Phone, AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),

  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  agreed: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { status } = useSession();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreed: false,
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const name = params.get("name");
      if (email) setValue("email", email);
      if (name) setValue("name", name);
    }
  }, [setValue]);

  const onSubmit = async (data: SignUpFormValues) => {
    setAuthError("");
    setLoading(true);
    
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("koshin_onboarded");
      }
      // 1. Create user in Prisma Database via REST API
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || json.error || "Failed to create an account.");
      }

      // 2. Sign in via NextAuth Credentials
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // 3. Send Verification Email
      const verifyRes = await fetch("/api/v1/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const verifyJson = await verifyRes.json();

      // Dual-dispatch: if server-side EmailJS was blocked by non-browser security policy, dispatch via client-side @emailjs/browser
      if (verifyJson?.code && !verifyJson?.emailSent) {
        try {
          const emailjs = (await import("@emailjs/browser")).default;
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_dvicy8b",
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_ii8om4m",
            {
              to_email: data.email,
              email: data.email,
              passcode: verifyJson.code,
              code: verifyJson.code,
              company_name: "Koshin AI",
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "JtOjDhYRDchP6rMsp"
          );
          console.log("[EmailJS Client] Verification email delivered directly to", data.email);
        } catch (emailErr) {
          console.error("[EmailJS Client Dispatch Error]:", emailErr);
        }
      }

      setRedirecting(true);
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setAuthError(err.message || "Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-offwhite text-ink flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Premium Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-[url('/bgimagesignup.png')] bg-cover bg-center p-12 flex-col justify-between overflow-hidden">

        {/* Logo and Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-32 w-auto object-contain brightness-0 invert scale-110 origin-left drop-shadow-md" />
        </Link>

        {/* Visual Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-navy/40 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
            <Sparkles className="size-3.5 text-cyan" /> Start Your Journey
          </div>
          <h2 className="display text-4xl sm:text-5xl font-bold leading-tight text-white drop-shadow-lg">
            Unlock Financial Clarity.
          </h2>
          <p className="text-sm text-white font-medium leading-relaxed drop-shadow-md">
            Join Koshin today to start categorizing expenses, uncovering hidden leaks, and building a healthier financial future.
          </p>
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
            <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-24 w-auto object-contain" />
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
                {authError && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Full name"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                        suppressHydrationWarning
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 pl-2 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Phone <span className="text-ink/40 font-normal">(Opt)</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="Phone number"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                        suppressHydrationWarning
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
                      {...register("email")}
                      placeholder="you@example.com"
                      className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-4 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                      suppressHydrationWarning
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 pl-2 mt-1">{errors.email.message}</p>}
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-[2]">
                    <label className="text-sm font-medium text-ink/80">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Create password"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-10 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                        suppressHydrationWarning
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60 focus:outline-none"
                        suppressHydrationWarning
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 pl-2 mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-ink/80">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Confirm password"
                        className="w-full rounded-full border border-hairline bg-offwhite py-2.5 pr-10 pl-10 text-sm text-ink placeholder-ink/40 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                        suppressHydrationWarning
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60 focus:outline-none"
                        suppressHydrationWarning
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 pl-2 mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
                <div className="text-xs text-ink/60 pl-2 mt-1">
                  Requirements: 8+ chars, 1 number, 1 upper/lowercase
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("agreed")}
                    className="mt-0.5 size-4 rounded border-hairline bg-offwhite text-purple focus:ring-purple"
                  />
                  <label htmlFor="terms" className="text-xs text-ink/70 leading-relaxed flex flex-col">
                    <span>
                      I agree to Koshin&apos;s{" "}
                      <Link href="/terms" className="text-purple hover:underline" target="_blank">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple hover:underline" target="_blank">
                        Privacy Policy
                      </Link>
                    </span>
                    {errors.agreed && <span className="text-red-500 mt-1">{errors.agreed.message}</span>}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full rounded-full bg-purple py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
                  suppressHydrationWarning
                >
                  {redirecting ? "Redirecting to Setup..." : loading ? "Creating..." : "Create Account"}
                </button>
              </form>

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
