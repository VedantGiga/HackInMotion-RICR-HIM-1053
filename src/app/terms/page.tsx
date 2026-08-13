"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-offwhite text-ink py-12 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-hairline/20"
          >
            <ArrowLeft className="size-4" /> Back to Signup
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <img src="/logofinal-bgremoved.png" alt="Koshin Logo" className="h-8 w-auto object-contain" />
          </Link>
        </header>

        <main className="bg-white p-8 sm:p-12 rounded-3xl border border-hairline shadow-sm space-y-8">
          <div>
            <h1 className="display text-3xl font-bold tracking-tight text-ink mb-2">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
          </div>

          <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Koshin's Financial Intelligence platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">2. Description of Service</h2>
              <p>
                Koshin provides automated transaction categorization, financial health scores, subscription tracking, and AI-driven financial insights. We do not provide professional financial, legal, or tax advice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">3. User Data and Security</h2>
              <p>
                You retain all rights to your financial data. We employ bank-grade encryption to secure your information. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">4. Limitation of Liability</h2>
              <p>
                Koshin shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
