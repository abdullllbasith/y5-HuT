import React from 'react';
import { PriceDraft } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';
import { PriceInput } from './PriceInput';
import { ChangeStatus, formatUpdated } from './ChangeStatus';
import { formatLKR } from '../../../lib/priceValidation';

export const PriceTable: React.FC<{ rows: PriceRow[]; draft: PriceDraft }> = ({ rows, draft }) => (
  <div className="hidden md:block bg-card rounded-2xl border border-line overflow-x-auto shadow-hard-sm">
    <table className="w-full text-left text-xs font-ui">
      <thead className="bg-paper-sunk border-b border-line text-ink-soft uppercase font-data text-[10px] tracking-wider font-bold">
        <tr className="h-11">
          <th className="px-3 py-2 w-8"><span className="sr-only">Select</span></th>
          <th className="px-3 py-2">Device / Variant Tag</th>
          <th className="px-3 py-2">Brand</th>
          <th className="px-3 py-2">SKU</th>
          <th className="px-3 py-2 text-right">Current Price</th>
          <th className="px-3 py-2 text-right">New Price (LKR)</th>
          <th className="px-3 py-2">Change</th>
          <th className="px-3 py-2 text-right">Stock</th>
          <th className="px-3 py-2">Last Updated</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {rows.map((r, i) => {
          const entry = draft.entryByKey.get(r.key);
          const isDrafted = !!entry;
          return (
            <tr
              key={r.key}
              className={`h-12 transition-colors ${
                isDrafted
                  ? 'bg-highlighter/20 hover:bg-highlighter/30'
                  : 'hover:bg-paper-sunk/60'
              }`}
            >
              <td className="px-3 py-2.5">
                <input
                  type="checkbox"
                  aria-label={`Select ${r.name} ${r.sku}`}
                  checked={draft.selected.has(r.key)}
                  onChange={() => draft.toggleSelected(r.key)}
                  className="w-4 h-4 rounded text-red accent-red cursor-pointer"
                />
              </td>
              <td className="px-3 py-2.5">
                <div className="font-ui font-bold text-ink">{r.name}</div>
                {(r.storage || r.color) && (
                  <div className="font-data text-[11px] text-ink-soft">
                    {[r.storage, r.color].filter(Boolean).join(' · ')}
                  </div>
                )}
              </td>
              <td className="px-3 py-2.5 font-data text-[11px] text-ink">{r.brand}</td>
              <td className="px-3 py-2.5 font-data text-[11px] text-ink-soft">{r.sku}</td>
              <td className="px-3 py-2.5 text-right font-data tabular-nums font-bold text-ink">
                {formatLKR(r.priceLKR)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <div className="inline-block">
                  <PriceInput
                    row={r}
                    index={i}
                    value={draft.drafts[r.key]}
                    entry={entry}
                    onChange={draft.setDraft}
                  />
                </div>
              </td>
              <td className="px-3 py-2.5">
                <ChangeStatus entry={entry} current={r.priceLKR} />
              </td>
              <td className="px-3 py-2.5 text-right font-data tabular-nums">
                {r.stock === 0 ? (
                  <span className="text-red font-bold">0</span>
                ) : (
                  <span className="text-ink">{r.stock}</span>
                )}
              </td>
              <td className="px-3 py-2.5 font-data text-[10px] text-ink-soft whitespace-nowrap">
                {formatUpdated(r.updatedAt)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
