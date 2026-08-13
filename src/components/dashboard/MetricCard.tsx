"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trendIcon: ReactNode;
  trendLabel: string;
  colorTheme: string; // e.g. "cyan", "pinkish", "purple"
  isNetReserve?: boolean;
}

export function MetricCard({
  title,
  value,
  icon,
  trendIcon,
  trendLabel,
  colorTheme,
  isNetReserve = false,
}: MetricCardProps) {
  // Map our simple color theme names to Tailwind classes
  const themeMap: Record<string, { bg: string, text: string }> = {
    cyan: { bg: "bg-cyan/10", text: "text-cyan" },
    pinkish: { bg: "bg-pinkish/10", text: "text-pinkish" },
    purple: { bg: "bg-purple/10", text: "text-purple" },
  };

  const theme = themeMap[colorTheme] || themeMap.cyan;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col justify-between relative overflow-hidden`}
    >
      {isNetReserve && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{title}</span>
          <div className={`p-1.5 rounded-lg ${theme.bg} ${theme.text}`}>
            {trendIcon}
          </div>
        </div>
        <div className={`display text-3xl font-bold tracking-tight mt-1 ${isNetReserve ? (value.startsWith('-') ? 'text-pinkish' : 'text-purple') : 'text-ink'}`}>
          {value}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-hairline relative">
        <div className={theme.text}>
          {icon}
        </div>
        <span className="text-[11px] text-muted-foreground font-semibold">{trendLabel}</span>
      </div>
    </motion.div>
  );
}
