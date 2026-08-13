"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useTheme } from "next-themes";

export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === "dark" || theme === "dark") : false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="display text-2xl font-bold text-ink tracking-tight">Account Settings</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="rounded-2xl border border-hairline bg-background shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-offwhite/50">
          <h4 className="text-[15px] font-bold text-ink">Profile Information</h4>
          <p className="text-[13px] text-muted-foreground mt-1">Update your personal details here.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="size-16 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0 shadow-inner">
              <User className="size-6 text-purple" />
            </div>
            <button className="px-4 py-2 border border-hairline rounded-lg text-[13px] font-bold shadow-sm hover:bg-offwhite transition-colors">
              Change Avatar
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First Name</label>
              <input type="text" defaultValue="Alex" className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last Name</label>
              <input type="text" defaultValue="Morgan" className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
              <input type="email" defaultValue="alex.morgan@example.com" className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-hairline bg-background shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-offwhite/50">
          <h4 className="text-[15px] font-bold text-ink">Preferences</h4>
          <p className="text-[13px] text-muted-foreground mt-1">Customize your Koshin experience.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-bold text-ink">Dark Mode</div>
              <div className="text-[13px] text-muted-foreground mt-0.5">Adjust the appearance of the dashboard.</div>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                isDark ? "bg-purple" : "bg-offwhite border border-hairline"
              }`}
              aria-label="Toggle Dark Mode"
            >
              <div
                className={`absolute top-1 size-4 rounded-full transition-all ${
                  isDark ? "right-1 bg-white" : "left-1 bg-muted-foreground"
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-hairline">
            <div>
              <div className="text-[14px] font-bold text-ink">Email Notifications</div>
              <div className="text-[13px] text-muted-foreground mt-0.5">Receive weekly digests and alerts.</div>
            </div>
            <div className="w-12 h-6 bg-purple rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 size-4 bg-white rounded-full transition-all shadow-sm"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-hairline">
            <div>
              <div className="text-[14px] font-bold text-ink">Two-Factor Authentication</div>
              <div className="text-[13px] text-muted-foreground mt-0.5">Enhance your account security.</div>
            </div>
            <button className="px-4 py-2 border border-hairline rounded-lg text-[13px] font-bold shadow-sm hover:bg-offwhite transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
      
      {/* Save action */}
      <div className="flex justify-end pt-2">
        <button className="px-6 py-3 bg-ink text-white rounded-xl text-[14px] font-bold shadow-md hover:bg-ink/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
