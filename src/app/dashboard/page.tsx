"use client";

import { KoshinDashboard } from "@/components/site/KoshinDashboard";
import { Footer } from "@/components/site/Footer";

export default function DashboardPage() {
  return (
    <main className="bg-ink min-h-screen text-background">
      <div className="pt-16">
        <KoshinDashboard />
      </div>
      <Footer />
    </main>
  );
}
