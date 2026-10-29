import React, { useMemo } from 'react';
import { PriceDraft } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';
import { PriceInput } from './PriceInput';
import { ChangeStatus, formatUpdated } from './ChangeStatus';
import { formatLKR } from '../../../lib/priceValidation';

const stockBadge = (stock: number) =>
  stock === 0
    ? ['Out of stock', 'bg-rose-100 text-rose-800']
    : stock <= 3
      ? [`${stock} left`, 'bg-amber-100 text-amber-800']
      : [`${stock} in stock`, 'bg-slate-100 text-slate-700'];

/** Phone layout: variants grouped under their model, one roomy card per variant. */
export const PriceCards: React.FC<{ rows: PriceRow[]; draft: PriceDraft }> = ({ rows, draft }) => {
  const groups = useMemo(() => {
    const map = new Map<string, PriceRow[]>();
    rows.forEach((r) => map.set(r.productId, [...(map.get(r.productId) ?? []), r]));
    return Array.from(map.values());
  }, [rows]);
  let index = 0;

  return (
    <div className="md:hidden space-y-4">
      {groups.map((group) => (
        <section key={group[0].productId} aria-label={group[0].name} className="space-y-2">
          <header className="px-1">
            <h3 className="text-sm font-black text-slate-900 leading-snug">{group[0].name}</h3>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {group[0].brand} · {group.length} variant{group.length === 1 ? '' : 's'}
            </p>
          </header>

          {group.map((r) => {
            const entry = draft.entryByKey.get(r.key);
            const selected = draft.selected.has(r.key);
            const variant = [r.storage, r.color].filter(Boolean).join(' · ');
            const [stockText, stockTone] = stockBadge(r.stock);
            const i = index++;
            return (
              <article
                key={r.key}
                className={`rounded-xl border bg-white shadow-xs ${entry ? 'border-amber-300 bg-amber-50/40' : selected ? 'border-[#E11D48]/50' : 'border-slate-200'}`}
              >
                <div className="flex items-start">
                  {/* Whole left column is the tap target for selecting this variant */}
                  <label className="shrink-0 w-12 min-h-12 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name} ${variant || r.sku}`}
                      checked={selected}
                      onChange={() => draft.toggleSelected(r.key)}
                      className="w-5 h-5 accent-[#E11D48]"
                    />
                  </label>
                  <div className="flex-1 min-w-0 py-3 pr-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 break-words">{variant || 'Standard'}</div>
                        <div className="text-[10px] font-mono text-slate-400 break-all">{r.sku}</div>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${stockTone}`}>{stockText}</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Current price</span>
                      <span className="text-base font-black font-mono tabular-nums text-slate-900">{formatLKR(r.priceLKR)}</span>
                    </div>

                    <div>
                      <span className="block mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">New price (LKR)</span>
                      <PriceInput block row={r} index={i} value={draft.drafts[r.key]} entry={entry} onChange={draft.setDraft} />
                    </div>

                    {entry && (
                      <div className="rounded-lg bg-white/80 border border-amber-200 px-3 py-2">
                        <ChangeStatus entry={entry} current={r.priceLKR} />
                      </div>
                    )}
                    {r.updatedAt && <div className="text-[10px] text-slate-400">Last updated {formatUpdated(r.updatedAt)}</div>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
};
