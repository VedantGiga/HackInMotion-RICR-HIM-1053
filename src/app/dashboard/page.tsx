"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KoshinDashboard } from "@/components/site/KoshinDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!(session.user as any).emailVerified) {
        router.replace(`/verify?email=${encodeURIComponent(session.user.email || "")}`);
        return;
      }
      
      const hasOnboarded = localStorage.getItem("koshin_onboarded");
      if (hasOnboarded !== "true") {
        router.replace("/onboarding");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="min-h-screen bg-background flex items-center justify-center text-ink"><div className="size-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin" /></div>;
  }

  // Prevent flash while redirecting
  if (!(session?.user as any)?.emailVerified || typeof window !== "undefined" && localStorage.getItem("koshin_onboarded") !== "true") {
    return <div className="min-h-screen bg-background flex items-center justify-center text-ink"><div className="size-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin" /></div>;
  }

  return (
    <main className="bg-background min-h-screen text-ink">
      <KoshinDashboard />
    </main>
  );
}
