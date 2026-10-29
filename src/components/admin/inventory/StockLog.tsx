import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { reasonLabel } from '../../../lib/stock';

/** Recent manual stock changes made in this browser. */
export const StockLog: React.FC = () => {
  const { stockLog } = useStore();
  const [all, setAll] = useState(false);
  const shown = all ? stockLog : stockLog.slice(0, 8);

  return (
    <section aria-label="Recent stock adjustments" className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900">Recent stock adjustments</h3>
      <p className="text-[11px] text-slate-500 mb-2">Saved in this browser only. Customer demo orders are not listed here.</p>
      {stockLog.length === 0 ? (
        <p className="text-xs text-slate-500">No adjustments yet. Use “Adjust” on any row.</p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {shown.map((e) => (
              <li key={e.id} className="py-2 flex flex-wrap items-start justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{e.productName}{e.label && ` · ${e.label}`}</div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-mono">{e.sku}</span> · {reasonLabel(e.reason)}{e.note && ` · “${e.note}”`}
                  </div>
                  <div className="text-[10px] text-slate-400">{new Date(e.at).toLocaleString()} · {e.by}</div>
                </div>
                <div className="font-mono tabular-nums font-bold">
                  {e.before} → <span className={e.after === 0 ? 'text-rose-600' : ''}>{e.after}</span>
                  <span className={`ml-1 ${e.after >= e.before ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ({e.after >= e.before ? '+' : '−'}{Math.abs(e.after - e.before)})
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {stockLog.length > 8 && (
            <button onClick={() => setAll(!all)} className="mt-2 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer">
              {all ? 'Show fewer' : `Show all ${stockLog.length}`}
            </button>
          )}
        </>
      )}
    </section>
  );
};
