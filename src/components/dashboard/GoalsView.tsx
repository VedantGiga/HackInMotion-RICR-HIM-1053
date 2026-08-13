"use client";

import { useState } from "react";
import { PlusCircle, ShieldCheck, Car, Target } from "lucide-react";

export function GoalsView() {
  const [goals, setGoals] = useState<Array<{ id: string; title: string; subtitle: string; current: number; target: number; tag: string }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;
    const goalObj = {
      id: Date.now().toString(),
      title: newTitle,
      subtitle: "Custom Savings Target",
      current: 0,
      target: parseFloat(newTarget),
      tag: "In Progress"
    };
    setGoals(prev => [...prev, goalObj]);
    setNewTitle("");
    setNewTarget("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-hairline bg-background p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="display text-2xl font-bold text-ink tracking-tight">Savings Goals</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Plan for the future and track your progress.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-purple/90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="size-4" /> {showForm ? "Cancel" : "New Goal"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} className="p-6 rounded-2xl border border-purple/30 bg-purple/5 space-y-4 max-w-lg">
          <h4 className="font-bold text-ink text-sm">Create New Savings Target</h4>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Goal Name (e.g., Emergency Reserve, New Car)"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-white text-xs font-semibold text-ink outline-none focus:border-purple"
            />
            <input 
              type="number" 
              placeholder="Target Amount ($)"
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-white text-xs font-semibold text-ink outline-none focus:border-purple"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-purple text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple/90 cursor-pointer">
            Save Goal
          </button>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-background p-12 text-center shadow-sm space-y-3">
          <div className="size-12 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto text-cyan">
            <Target className="size-6" />
          </div>
          <h4 className="display text-lg font-bold text-ink">No Active Savings Goals</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click &quot;+ New Goal&quot; to define your financial targets and let Koshin track your funding progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g) => {
            const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
            return (
              <div key={g.id} className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                      <Target className="size-5 text-cyan" />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">{g.title}</div>
                      <div className="text-[12px] font-semibold text-muted-foreground">{g.subtitle}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-purple/10 text-purple text-[11px] font-bold uppercase tracking-wider">
                    {g.tag}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-2">
                    <div className="text-3xl font-bold text-ink tracking-tight">${g.current.toLocaleString()}</div>
                    <div className="text-[13px] font-medium text-muted-foreground mb-1">Target: ${g.target.toLocaleString()}</div>
                  </div>
                  <div className="h-2.5 w-full bg-offwhite rounded-full overflow-hidden">
                    <div className="h-full bg-cyan rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[12px] font-bold text-muted-foreground">
                    <span>{pct}% Funded</span>
                    <span>Goal Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
