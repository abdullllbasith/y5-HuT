import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { reasonLabel } from '../../../lib/stock';

/** Recent manual stock changes made in this browser. */
export const StockLog: React.FC = () => {
  const { stockLog } = useStore();
  const [all, setAll] = useState(false);
  const shown = all ? stockLog : stockLog.slice(0, 8);

  return (
    <section aria-label="Recent stock adjustments" className="bg-paper-card rounded-2xl border border-ink/10 p-4 sm:p-5 shadow-paper text-left space-y-2.5">
      <div>
        <h3 className="text-sm font-bold text-ink font-display">Recent Stock Adjustments</h3>
        <p className="text-[11px] text-ink-muted">Saved in this browser only. Customer demo orders are not listed here.</p>
      </div>
      {stockLog.length === 0 ? (
        <p className="text-xs text-ink-muted py-3">No adjustments yet. Use “Adjust” on any row above.</p>
      ) : (
        <>
          <ul className="divide-y divide-ink/5">
            {shown.map((e) => (
              <li key={e.id} className="py-2.5 flex flex-wrap items-start justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-ink">{e.productName}{e.label && ` · ${e.label}`}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    <span className="font-mono text-ink-muted font-semibold">{e.sku}</span> · {reasonLabel(e.reason)}{e.note && ` · “${e.note}”`}
                  </div>
                  <div className="text-[10px] text-ink-muted/70 mt-0.5">{new Date(e.at).toLocaleString()} · {e.by}</div>
                </div>
                <div className="font-data tabular-nums font-bold text-xs shrink-0 text-right">
                  <span className="text-ink-muted">{e.before}</span> → <span className={e.after === 0 ? 'text-red font-black' : 'text-ink'}>{e.after}</span>
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${e.after >= e.before ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-red border border-rose-200'}`}>
                    {e.after >= e.before ? '+' : '−'}{Math.abs(e.after - e.before)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {stockLog.length > 8 && (
            <button onClick={() => setAll(!all)} className="mt-2 text-xs font-bold text-red hover:underline cursor-pointer">
              {all ? 'Show fewer' : `Show all ${stockLog.length}`}
            </button>
          )}
        </>
      )}
    </section>
  );
};
