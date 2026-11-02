import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { reasonLabel } from '../../../lib/stock';

/** Recent manual stock changes made in this browser. */
export const StockLog: React.FC = () => {
  const { stockLog } = useStore();
  const [all, setAll] = useState(false);
  const shown = all ? stockLog : stockLog.slice(0, 8);

  return (
    <section aria-label="Recent stock adjustments" className="bg-white rounded-[18px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs text-left space-y-2.5">
      <div>
        <h3 className="text-sm font-bold text-[#111827] font-sans">Recent Stock Adjustments</h3>
        <p className="text-[11px] text-[#6B7280]">Saved in this browser only. Customer demo orders are not listed here.</p>
      </div>
      {stockLog.length === 0 ? (
        <p className="text-xs text-slate-500 py-3">No adjustments yet. Use “Adjust” on any row above.</p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {shown.map((e) => (
              <li key={e.id} className="py-2.5 flex flex-wrap items-start justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#111827]">{e.productName}{e.label && ` · ${e.label}`}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    <span className="font-mono text-slate-500 font-semibold">{e.sku}</span> · {reasonLabel(e.reason)}{e.note && ` · “${e.note}”`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(e.at).toLocaleString()} · {e.by}</div>
                </div>
                <div className="font-mono tabular-nums font-bold text-xs shrink-0 text-right">
                  <span className="text-slate-500">{e.before}</span> → <span className={e.after === 0 ? 'text-rose-600 font-black' : 'text-[#111827]'}>{e.after}</span>
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${e.after >= e.before ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                    {e.after >= e.before ? '+' : '−'}{Math.abs(e.after - e.before)}
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
