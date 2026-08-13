"use client";

import { useState } from "react";
import { User, ShieldCheck, CheckCircle2, Camera, Key, Lock, CreditCard, Sparkles } from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
];

export function SettingsView() {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="rounded-3xl border border-hairline bg-white p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-3 py-1 text-xs font-semibold text-purple mb-2">
            <Sparkles className="size-3.5" /> User Security & Profile Hub
          </div>
          <h3 className="display text-2xl font-bold text-ink tracking-tight">Account Settings</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Manage your identity, avatar presets, linked banks, and 256-bit security vault.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-ink text-white text-xs font-bold hover:bg-purple transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          {savedSuccess ? "✓ Saved Changes" : "Save Settings"}
        </button>
      </div>

      {/* ULTRA-PREMIUM AVATARS & PROFILE CARD */}
      <div className="rounded-3xl border border-hairline bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-offwhite/50 flex items-center justify-between">
          <div>
            <h4 className="text-[15px] font-bold text-ink">Personal Profile & Identity</h4>
            <p className="text-[13px] text-muted-foreground mt-0.5">Customize your public avatar and personal details.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Verified Tier 1
          </span>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Avatar Selector Stage */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
              Profile Avatar & Badging
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-offwhite/60 border border-hairline/80">
              <div className="relative shrink-0">
                <img
                  src={selectedAvatar}
                  alt="Selected Profile Avatar"
                  className="size-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-sm font-bold text-ink flex items-center gap-2">
                    <span>Alex Morgan</span>
                    <span className="text-xs text-purple font-bold bg-purple/10 px-2 py-0.5 rounded-full border border-purple/20">
                      Pro Member
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a high-resolution avatar preset or upload a custom image.
                  </p>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center gap-3 pt-1">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative rounded-full transition-transform hover:scale-110 cursor-pointer ${
                        selectedAvatar === url ? "ring-2 ring-purple ring-offset-2" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="size-10 rounded-full object-cover shadow-xs" />
                    </button>
                  ))}
                  <button className="size-10 rounded-full border border-dashed border-hairline bg-white flex items-center justify-center text-muted-foreground hover:text-ink hover:border-purple transition-all shadow-xs cursor-pointer" title="Upload Custom Photo">
                    <Camera className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
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

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 234-8901" className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Savings Target</label>
              <input type="text" defaultValue="$1,500 / month" className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>
          </div>

        </div>
      </div>

      {/* SECURITY & LINKED ACCOUNTS */}
      <div className="rounded-3xl border border-hairline bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-offwhite/50">
          <h4 className="text-[15px] font-bold text-ink">Security & Connected Vaults</h4>
          <p className="text-[13px] text-muted-foreground mt-1">Bank-grade encryption, active devices, and credentials.</p>
        </div>

        <div className="p-6 space-y-5">
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-offwhite/60 border border-hairline">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-ink">Two-Factor Authentication (2FA)</div>
                <div className="text-[12px] text-muted-foreground">Encrypted SMS & Authenticator App enabled</div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Active & Protected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-offwhite/60 border border-hairline">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <CreditCard className="size-5" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-ink">Connected Bank Vaults</div>
                <div className="text-[12px] text-muted-foreground">3 Bank Accounts & Credit Cards synced</div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-purple bg-purple/10 px-3 py-1 rounded-full border border-purple/20">
              3 Active Syncs
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
