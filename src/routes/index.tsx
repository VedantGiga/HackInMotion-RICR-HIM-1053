import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { PerformanceSection } from "@/components/site/PerformanceSection";
import { OverviewSection } from "@/components/site/OverviewSection";
import { CapabilitiesSection } from "@/components/site/CapabilitiesSection";
import { CaseStudies } from "@/components/site/CaseStudies";
import { StatsSection } from "@/components/site/StatsSection";
import { OrbitSection } from "@/components/site/OrbitSection";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { useLenis } from "@/lib/use-lenis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatrixPay — White-Label Payment Gateway Infrastructure" },
      {
        name: "description",
        content:
          "MatrixPay is a modern white-label payment gateway for fintechs, PSPs, ISOs and merchants. Cards, APMs, fraud prevention and developer tools — live in days.",
      },
      { property: "og:title", content: "MatrixPay — Smarter Payments Start Here" },
      {
        property: "og:description",
        content:
          "White-label payment infrastructure with cards, alternative payments, fraud prevention and flexible deployment.",
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
      <StatsSection />
      <OrbitSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
