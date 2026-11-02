import React, { useMemo } from 'react';
import { PriceDraft } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';
import { PriceInput } from './PriceInput';
import { ChangeStatus, formatUpdated } from './ChangeStatus';
import { formatLKR } from '../../../lib/priceValidation';

const stockBadge = (stock: number) =>
  stock === 0
    ? ['Out of stock', 'bg-red-wash text-red border border-red/20 font-bold']
    : stock <= 3
    ? [`${stock} left`, 'bg-highlighter/30 text-ink border border-line font-bold']
    : [`${stock} in stock`, 'bg-paper-sunk text-ink-soft border border-line font-medium'];

export const PriceCards: React.FC<{ rows: PriceRow[]; draft: PriceDraft }> = ({ rows, draft }) => {
  const groups = useMemo(() => {
    const map = new Map<string, PriceRow[]>();
    rows.forEach((r) => map.set(r.productId, [...(map.get(r.productId) ?? []), r]));
    return Array.from(map.values());
  }, [rows]);
  let index = 0;

  return (
    <div className="md:hidden space-y-4 text-left font-ui">
      {groups.map((group) => (
        <section key={group[0].productId} aria-label={group[0].name} className="space-y-2">
          <header className="px-1">
            <h3 className="font-display text-base font-bold text-ink leading-snug">{group[0].name}</h3>
            <p className="font-data text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              {group[0].brand} · {group.length} variant tag{group.length === 1 ? '' : 's'}
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
                className={`rounded-2xl border bg-card shadow-hard-sm transition-all ${
                  entry
                    ? 'border-ink bg-highlighter/20'
                    : selected
                    ? 'border-red ring-1 ring-red'
                    : 'border-line'
                }`}
              >
                <div className="flex items-start">
                  {/* Tap target for selecting this variant */}
                  <label className="shrink-0 w-12 min-h-12 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name} ${variant || r.sku}`}
                      checked={selected}
                      onChange={() => draft.toggleSelected(r.key)}
                      className="w-5 h-5 rounded text-red accent-red cursor-pointer"
                    />
                  </label>
                  <div className="flex-1 min-w-0 py-3.5 pr-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-ui font-bold text-sm text-ink break-words">{variant || 'Standard Spec'}</div>
                        <div className="font-data text-[10px] text-ink-soft break-all">{r.sku}</div>
                      </div>
                      <span className={`shrink-0 font-data text-[10px] px-2 py-0.5 rounded-full ${stockTone}`}>
                        {stockText}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-line/60">
                      <span className="font-data text-[10px] uppercase font-bold text-ink-soft">Current Tag</span>
                      <span className="font-data text-base font-bold tabular-nums text-ink">{formatLKR(r.priceLKR)}</span>
                    </div>

                    <div>
                      <span className="block mb-1 font-data text-[10px] font-bold uppercase text-ink-soft">New Rupee Price</span>
                      <PriceInput block row={r} index={i} value={draft.drafts[r.key]} entry={entry} onChange={draft.setDraft} />
                    </div>

                    {entry && (
                      <div className="rounded-xl bg-card border border-line px-3 py-2 shadow-2xs">
                        <ChangeStatus entry={entry} current={r.priceLKR} />
                      </div>
                    )}
                    {r.updatedAt && (
                      <div className="font-data text-[9px] text-ink-soft/70">
                        Last updated {formatUpdated(r.updatedAt)}
                      </div>
                    )}
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
