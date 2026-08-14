"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/context/AuthContext";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // 1. If not authenticated, redirect to login page
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // 2. If authenticated
    if (status === "authenticated") {
      const isOnboarded = typeof window !== "undefined" && localStorage.getItem("koshin_onboarded") === "true";

      // If user has already completed onboarding (and is not currently on the processing page finishing setup), redirect to dashboard
      if (isOnboarded && !pathname.includes("/onboarding/processing")) {
        router.replace("/dashboard");
        return;
      }

      setIsAllowed(true);
    }
  }, [status, pathname, router]);

  if (status === "loading" || !isAllowed) {
    return (
      <div className="h-screen w-full bg-offwhite flex items-center justify-center">
        <div className="size-6 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
