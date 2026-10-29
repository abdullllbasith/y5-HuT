import React from 'react';
import { PriceDraft } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';
import { PriceInput } from './PriceInput';
import { ChangeStatus, formatUpdated } from './ChangeStatus';
import { formatLKR } from '../../../lib/priceValidation';

export const PriceTable: React.FC<{ rows: PriceRow[]; draft: PriceDraft }> = ({ rows, draft }) => (
  <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
    <table className="w-full text-left text-xs">
      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
        <tr>
          <th className="px-3 py-3 w-8"><span className="sr-only">Select</span></th>
          <th className="px-3 py-3">Product / variant</th>
          <th className="px-3 py-3">Brand</th>
          <th className="px-3 py-3">SKU</th>
          <th className="px-3 py-3 text-right">Current (LKR)</th>
          <th className="px-3 py-3 text-right">New price (LKR)</th>
          <th className="px-3 py-3">Change</th>
          <th className="px-3 py-3 text-right">Stock</th>
          <th className="px-3 py-3">Last updated</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((r, i) => {
          const entry = draft.entryByKey.get(r.key);
          return (
            <tr key={r.key} className={entry ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  aria-label={`Select ${r.name} ${r.sku}`}
                  checked={draft.selected.has(r.key)}
                  onChange={() => draft.toggleSelected(r.key)}
                  className="w-4 h-4 accent-[#E11D48] cursor-pointer"
                />
              </td>
              <td className="px-3 py-2">
                <div className="font-bold text-slate-900">{r.name}</div>
                {(r.storage || r.color) && (
                  <div className="text-[11px] text-slate-500">{[r.storage, r.color].filter(Boolean).join(' · ')}</div>
                )}
              </td>
              <td className="px-3 py-2">{r.brand}</td>
              <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{r.sku}</td>
              <td className="px-3 py-2 text-right font-mono tabular-nums font-bold">{formatLKR(r.priceLKR)}</td>
              <td className="px-3 py-2 text-right">
                <div className="inline-block">
                  <PriceInput row={r} index={i} value={draft.drafts[r.key]} entry={entry} onChange={draft.setDraft} />
                </div>
              </td>
              <td className="px-3 py-2">
                <ChangeStatus entry={entry} current={r.priceLKR} />
              </td>
              <td className="px-3 py-2 text-right font-mono tabular-nums">
                {r.stock === 0 ? <span className="text-rose-600 font-bold">0</span> : r.stock}
              </td>
              <td className="px-3 py-2 text-[11px] text-slate-500 whitespace-nowrap">{formatUpdated(r.updatedAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
