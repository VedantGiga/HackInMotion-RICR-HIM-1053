"use client";

import { Transaction, getCatConfig } from "@/components/site/KoshinDashboard";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-2xl border border-hairline bg-background shadow-sm overflow-hidden">
      {transactions.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mx-auto text-purple">
            <span className="text-xl font-bold">💳</span>
          </div>
          <h4 className="display text-lg font-bold text-ink">No Transactions Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Your transaction log is empty. Upload a bank CSV or scan a receipt to view your line items here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hairline bg-offwhite/50">
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Merchant</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Category</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const cfg = getCatConfig(tx.category);
                const Icon = cfg.icon;
                return (
                  <tr key={tx.id} className="border-b border-hairline hover:bg-offwhite transition-colors last:border-0">
                    <td className="py-4 px-6 text-[13px] font-medium text-muted-foreground whitespace-nowrap">{tx.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                          <Icon className={`size-4 ${cfg.color}`} />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-[14px]">{tx.merchant}</div>
                          {tx.isRecurring && (
                            <span className="mt-1 inline-block text-[10px] font-bold text-cyan-700 bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">Recurring</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md ${cfg.bg} ${cfg.color} text-[12px] font-bold border ${cfg.border}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-12 bg-offwhite rounded-full overflow-hidden">
                          <div className="h-full bg-cyan rounded-full" style={{ width: `${Math.round(tx.confidence * 100)}%` }} />
                        </div>
                        <span className="font-bold text-[12px] text-ink">{Math.round(tx.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                        tx.type === 'income' ? 'bg-purple/10 text-purple border-purple/20' : 'bg-pinkish/10 text-pinkish border-pinkish/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-[15px] whitespace-nowrap ${
                      tx.type === 'income' ? 'text-cyan-700' : 'text-ink'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
