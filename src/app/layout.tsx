import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
};

export const metadata: Metadata = {
  title: "Koshin — Smart Expense Analyzer & Financial Health Dashboard",
  description:
    "Because you can't fix what you can't see. Koshin automatically categorizes raw bank transactions, tracks your financial health score, detects silent subscriptions, and provides plain-language advisor insights.",
  icons: {
    icon: "/klogofinal.png",
    shortcut: "/klogofinal.png",
    apple: "/klogofinal.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/klogofinal.png" />
        <link rel="shortcut icon" href="/klogofinal.png" />
        <link rel="apple-touch-icon" href="/klogofinal.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
