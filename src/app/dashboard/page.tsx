"use client";

import { Navbar } from "@/components/site/Navbar";
import { KoshinDashboard } from "@/components/site/KoshinDashboard";

export default function DashboardPage() {
  return (
    <main className="bg-ink min-h-screen text-background">
      <Navbar />
      <div className="pt-16">
        <KoshinDashboard />
      </div>
    </main>
  );
}
