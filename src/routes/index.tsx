import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { PerformanceSection } from "@/components/site/PerformanceSection";
import { OverviewSection } from "@/components/site/OverviewSection";
import { CapabilitiesSection } from "@/components/site/CapabilitiesSection";
import { CaseStudies } from "@/components/site/CaseStudies";
import { KoshinDashboard } from "@/components/site/KoshinDashboard";
import { StatsSection } from "@/components/site/StatsSection";
import { OrbitSection } from "@/components/site/OrbitSection";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { useLenis } from "@/lib/use-lenis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koshin — Smart Expense Analyzer & Financial Health Dashboard" },
      {
        name: "description",
        content:
          "Because you can't fix what you can't see. Koshin automatically categorizes raw bank transactions, tracks your financial health score, detects silent subscriptions, and provides plain-language advisor insights.",
      },
      { property: "og:title", content: "Koshin — Smart Expense Analyzer & Financial Health Dashboard" },
      {
        property: "og:description",
        content:
          "Turn raw transaction data into real financial understanding. Auto-categorization, health score, subscription detector, and interactive savings simulator.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();

  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <PerformanceSection />
      <OverviewSection />
      <CapabilitiesSection />
      <CaseStudies />
      <KoshinDashboard />
      <StatsSection />
      <OrbitSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}

