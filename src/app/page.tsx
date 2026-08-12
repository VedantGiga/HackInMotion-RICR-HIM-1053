import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { PerformanceSection } from "@/components/site/PerformanceSection";
import { OverviewSection } from "@/components/site/OverviewSection";
import { CapabilitiesSection } from "@/components/site/CapabilitiesSection";
import { CaseStudies } from "@/components/site/CaseStudies";
import { CardStackingSection } from "@/components/site/CardStackingSection";
import { StatsSection } from "@/components/site/StatsSection";
import { OrbitSection } from "@/components/site/OrbitSection";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <PerformanceSection />
      <OverviewSection />
      <CapabilitiesSection />
      <CaseStudies />
      <CardStackingSection />
      <StatsSection />
      <OrbitSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
