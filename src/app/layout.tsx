import type { Metadata } from "next";
import "@/styles.css";

export const metadata: Metadata = {
  title: "Koshin — Smart Expense Analyzer & Financial Health Dashboard",
  description:
    "Because you can't fix what you can't see. Koshin automatically categorizes raw bank transactions, tracks your financial health score, detects silent subscriptions, and provides plain-language advisor insights.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
