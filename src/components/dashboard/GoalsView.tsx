"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Target, Trash2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface DBGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string | null;
  progressPercentage?: number;
  isCompleted?: boolean;
}

export function GoalsView() {
  const { data: session } = useSession();
  const curr = (session?.user as any)?.currency || "$";
  const [goals, setGoals] = useState<DBGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newCurrent, setNewCurrent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/goals");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setGoals(json.data);
        }
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTitle,
          targetAmount: parseFloat(newTarget),
          currentAmount: newCurrent ? parseFloat(newCurrent) : 0,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewTarget("");
        setNewCurrent("");
        setShowForm(false);
        await fetchGoals();
      } else {
        alert("Failed to create goal");
      }
    } catch (err) {
      console.error("Error creating goal:", err);
      alert("Error creating goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/goals?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGoals(prev => prev.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
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
              placeholder="Goal Name (e.g., Emergency Reserve, Japan Trip)"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-white text-xs font-semibold text-ink outline-none focus:border-purple"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="number" 
                placeholder={`Target Amount (${curr})`}
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-white text-xs font-semibold text-ink outline-none focus:border-purple"
                required
              />
              <input 
                type="number" 
                placeholder={`Initial Saved (${curr})`}
                value={newCurrent}
                onChange={e => setNewCurrent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-white text-xs font-semibold text-ink outline-none focus:border-purple"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-purple text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple/90 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : "Save Goal to DB"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <Loader2 className="size-4 animate-spin text-purple" /> Loading goals...
        </div>
      ) : goals.length === 0 ? (
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
            const current = g.currentAmount || 0;
            const target = g.targetAmount || 1;
            const pct = Math.min(Math.round((current / target) * 100), 100);
            const isCompleted = current >= target;

            return (
              <div key={g.id} className="rounded-2xl border border-hairline bg-background p-6 shadow-sm flex flex-col relative group">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                      <Target className="size-5 text-cyan" />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">{g.name}</div>
                      <div className="text-[12px] font-semibold text-muted-foreground">Target Goal</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-purple/10 text-purple'
                    }`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1 text-muted-foreground hover:text-pinkish transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-2">
                    <div className="text-3xl font-bold text-ink tracking-tight">{curr}{current.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="text-[13px] font-medium text-muted-foreground mb-1">Target: {curr}{target.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="h-2.5 w-full bg-offwhite rounded-full overflow-hidden">
                    <div className="h-full bg-cyan rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[12px] font-bold text-muted-foreground">
                    <span>{pct}% Funded</span>
                    <span>{isCompleted ? "Goal Completed!" : `$${(target - current).toFixed(2)} Remaining`}</span>
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
