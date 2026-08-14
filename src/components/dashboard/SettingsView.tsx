"use client";

import { useState, useEffect } from "react";
import { User, ShieldCheck, CheckCircle2, Camera, Key, Lock, CreditCard, Sparkles, Trash2, Plus } from "lucide-react";
import { useSession } from "@/context/AuthContext";
import { getCurrencySymbol } from "@/lib/utils";

export function SettingsView() {
  const { data: session, update } = useSession();
  const curr = (session?.user as any)?.currency || getCurrencySymbol();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rules, setRules] = useState([
    { id: "1", keyword: "Gas Station", category: "Travel & Rides" },
    { id: "2", keyword: "Starbucks", category: "Food & Dining" },
  ]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("Food & Dining");

  const newCategory_ = newCategory;
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userPhone = (session?.user as any)?.phone || "";
  const firstName = userName.split(" ")[0] || "";
  const lastName = userName.split(" ").slice(1).join(" ") || "";

  const [phoneInput, setPhoneInput] = useState("");
  const [currencyInput, setCurrencyInput] = useState(curr);
  const [salaryInput, setSalaryInput] = useState(typeof window !== "undefined" ? (localStorage.getItem("koshin_salary") || "5000") : "5000");
  const [isSaving, setIsSaving] = useState(false);

  // Sync session data to local state once it loads
  useEffect(() => {
    if (userPhone) setPhoneInput(userPhone);
    if (curr) setCurrencyInput(curr);
  }, [userPhone, curr]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    // Save phone, currency, and salary into DB
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("koshin_currency", currencyInput);
        if (salaryInput) localStorage.setItem("koshin_salary", salaryInput);
      }

      if (salaryInput && !isNaN(parseFloat(salaryInput))) {
        await fetch("/api/v1/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: "Monthly Salary",
            amount: parseFloat(salaryInput),
            date: new Date().toISOString().split("T")[0],
            categoryName: "Income",
            isRecurring: true,
          }),
        }).catch(() => null);
      }

      const payload: any = {};
      if (!userPhone && phoneInput.trim()) payload.phone = phoneInput.trim();
      if (currencyInput !== curr) payload.currency = currencyInput;

      if (Object.keys(payload).length > 0) {
        const res = await fetch("/api/v1/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await update(payload);
        }
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    }

    setSavedSuccess(true);
    setIsSaving(false);
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
          disabled={isSaving}
          className="px-6 py-2.5 rounded-full bg-ink text-white text-xs font-bold hover:bg-purple transition-all shadow-md cursor-pointer self-start md:self-auto disabled:opacity-70"
        >
          {isSaving ? "Saving..." : savedSuccess ? "✓ Saved Changes" : "Save Settings"}
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
          
          {/* User Profile Avatar Stage */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-offwhite/60 border border-hairline/80">
            <div className="relative shrink-0">
              <div className="size-20 rounded-full bg-gradient-to-tr from-purple to-cyan text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-md">
                {firstName ? firstName.charAt(0).toUpperCase() : <User className="size-8 text-white" />}
              </div>
              <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink">{userName}</p>
                <span className="text-xs text-purple font-bold bg-purple/10 px-2.5 py-0.5 rounded-full border border-purple/20">
                  Pro Member
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Account Email: <strong className="text-ink font-medium">{userEmail}</strong>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Member Tier: Verified Tier 1 • 256-bit SSL Vault Protection
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First Name</label>
              <input type="text" defaultValue={firstName} className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last Name</label>
              <input type="text" defaultValue={lastName} className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
              <input type="email" defaultValue={userEmail} className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Phone Number {!!userPhone && <Lock className="size-3 text-emerald-600" />}
              </label>
              <input 
                type="tel" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                readOnly={!!userPhone}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 rounded-xl border text-[14px] text-ink font-semibold focus:outline-none transition-colors ${
                  userPhone 
                    ? "bg-hairline/30 border-transparent text-ink/60 cursor-not-allowed" 
                    : "bg-offwhite border-hairline focus:border-purple focus:ring-1 focus:ring-purple"
                }`} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Salary / Base Income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink">{curr}</span>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  placeholder="5000"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Savings Target</label>
              <input type="text" defaultValue={`${curr}1,500 / month`} className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Base Currency</label>
              <select
                value={currencyInput}
                onChange={(e) => setCurrencyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-offwhite border border-hairline text-[14px] text-ink font-semibold focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors appearance-none"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="¥">JPY (¥)</option>
                <option value="₹">INR (₹)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* CUSTOM AI CATEGORIZATION RULES */}
      <div className="rounded-3xl border border-hairline bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-offwhite/50">
          <h4 className="text-[15px] font-bold text-ink">Custom AI Smart Categorization Rules</h4>
          <p className="text-[13px] text-muted-foreground mt-1">Override default NLP categorizations. Matching merchants automatically route to your selected category.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 rounded-xl bg-offwhite border border-hairline">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-ink">
                    If merchant contains <span className="font-mono text-purple px-1.5 py-0.5 bg-purple/10 rounded-md">&quot;{rule.keyword}&quot;</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-xs font-bold bg-white border border-hairline text-ink px-2.5 py-1 rounded-full">
                    {rule.category}
                  </span>
                </div>
                <button
                  onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}
                  className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-muted-foreground transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Rule Form */}
          <div className="flex flex-col sm:flex-row gap-4 items-end p-4 rounded-2xl bg-offwhite/50 border border-hairline/80">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Merchant Keyword</label>
              <input
                type="text"
                placeholder="e.g. Costco, Chevron, Uber"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white border border-hairline text-sm text-ink outline-none focus:border-purple"
              />
            </div>
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Target Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white border border-hairline text-sm text-ink outline-none focus:border-purple"
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Housing & Rent">Housing & Rent</option>
                <option value="Travel & Rides">Travel & Rides</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (!newKeyword.trim()) return;
                setRules((prev) => [
                  ...prev,
                  {
                    id: Math.random().toString(),
                    keyword: newKeyword.trim(),
                    category: newCategory,
                  },
                ]);
                setNewKeyword("");
              }}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-purple hover:bg-purple/90 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="size-4" />
              <span>Add Override Rule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
