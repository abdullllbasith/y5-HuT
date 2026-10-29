import React from 'react';
import { PriceDraft } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';
import { PriceInput } from './PriceInput';
import { ChangeStatus, formatUpdated } from './ChangeStatus';
import { formatLKR } from '../../../lib/priceValidation';

export const PriceCards: React.FC<{ rows: PriceRow[]; draft: PriceDraft }> = ({ rows, draft }) => (
  <div className="md:hidden space-y-2">
    {rows.map((r, i) => {
      const entry = draft.entryByKey.get(r.key);
      return (
        <div
          key={r.key}
          className={`rounded-xl border p-3 shadow-xs ${entry ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white'}`}
        >
          <div className="flex justify-between gap-2">
            <input
              type="checkbox"
              aria-label={`Select ${r.name} ${r.sku}`}
              checked={draft.selected.has(r.key)}
              onChange={() => draft.toggleSelected(r.key)}
              className="w-5 h-5 mt-0.5 shrink-0 accent-[#E11D48]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900 truncate">{r.name}</div>
              <div className="text-[11px] text-slate-500">
                {r.brand}
                {(r.storage || r.color) && ` · ${[r.storage, r.color].filter(Boolean).join(' · ')}`}
              </div>
              <div className="text-[10px] font-mono text-slate-400">{r.sku}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Current</div>
              <div className="text-sm font-mono font-bold tabular-nums">{formatLKR(r.priceLKR)}</div>
              <div className="text-[10px] text-slate-500">Stock {r.stock}</div>
            </div>
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <PriceInput row={r} index={i} value={draft.drafts[r.key]} entry={entry} onChange={draft.setDraft} />
            <ChangeStatus entry={entry} current={r.priceLKR} />
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Updated: {formatUpdated(r.updatedAt)}</div>
        </div>
      );
    })}
  </div>
);
