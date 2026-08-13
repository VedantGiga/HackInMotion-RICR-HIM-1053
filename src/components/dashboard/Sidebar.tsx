"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { User, LogOut, Sun, Moon } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  navItems: readonly NavItem[];
  healthScore: number;
  healthRingColor: string;
  isDashboardPage: boolean;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  navItems,
  healthScore,
  healthRingColor,
  isDashboardPage,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-64 z-30 transition-transform duration-300 lg:relative lg:transform-none
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      flex flex-col bg-background lg:bg-offwhite/50 border-r border-hairline
    `}>
      {/* Logo */}
      <div className="hidden lg:flex items-center gap-3 px-6 pt-7 pb-6">
        <img src="/logofinal-bgremoved.png" alt="Koshin" className="h-7 w-auto object-contain scale-[2.5] origin-left ml-3" />
      </div>

      {/* Nav section label */}
      <div className="px-6 mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Navigation</span>
      </div>

      {/* Nav items */}
      <nav className="px-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group relative
                ${isActive
                  ? "bg-white text-ink border border-hairline shadow-sm"
                  : "text-muted-foreground hover:text-ink hover:bg-black/5"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple rounded-r-full" />
              )}
              <Icon className={`size-4.5 shrink-0 transition-colors ${isActive ? "text-purple" : "text-muted-foreground group-hover:text-ink"}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  item.badge === "NEW"
                    ? "bg-purple text-white shadow-sm"
                    : "bg-black/5 text-muted-foreground"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider + bottom section */}
      <div className="mt-auto px-3 pb-5 pt-4 border-t border-hairline bg-white lg:bg-transparent">
        {/* Quick stats pill */}
        <div className="mx-1 mb-4 p-4 rounded-xl bg-background border border-hairline shadow-sm">
          <div className="flex items-center justify-between text-[11px] mb-2.5">
            <span className="text-muted-foreground font-semibold">Monthly Health</span>
            <span className={`font-bold ${healthRingColor}`}>{healthScore}/100</span>
          </div>
          <div className="h-1.5 w-full bg-offwhite rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-purple transition-all duration-700"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="size-9 rounded-full bg-offwhite border border-hairline flex items-center justify-center shrink-0 shadow-sm">
            <User className="size-4 text-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-ink truncate">Alex Morgan</div>
            <div className="text-[10px] text-purple font-semibold tracking-wide">Premium User</div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-ink transition-all"
            title="Toggle theme"
          >
            {mounted ? (theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />) : <Sun className="size-4" />}
          </button>
          {isDashboardPage && (
            <a href="/" title="Sign out" className="p-2 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-ink transition-all">
              <LogOut className="size-4" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
