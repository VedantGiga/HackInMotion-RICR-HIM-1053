"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <h1 className="display text-3xl font-bold tracking-tight text-ink mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
          </div>

          <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as your name and email address. When you connect financial accounts, we collect transaction data, merchant information, and account balances to provide our core services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">2. How We Use Your Data</h2>
              <p>
                Your data is strictly used to power the Koshin engine. We use it to categorize your transactions, calculate your financial health score, and generate personalized AI insights. <strong>We do not sell your personal financial data to third parties.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">3. Data Protection</h2>
              <p>
                We implement industry-standard encryption (AES-256) for data at rest and TLS for data in transit. Access to your raw financial data is strictly audited and limited to automated systems necessary for providing the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">4. Your Rights</h2>
              <p>
                You have the right to request a copy of your personal data, request corrections, or request the complete deletion of your account and associated financial data from our servers at any time.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
