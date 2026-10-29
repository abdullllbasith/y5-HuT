import React from 'react';
import { DraftEntry } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';

interface PriceInputProps {
  row: PriceRow;
  index: number;
  value: string | undefined;
  entry?: DraftEntry;
  onChange: (key: string, raw: string) => void;
  block?: boolean; // full-width, taller touch target (mobile cards)
}

/** Click, type an LKR amount, Enter jumps to the next row. Nothing is published here. */
export const PriceInput: React.FC<PriceInputProps> = ({ row, index, value, entry, onChange, block }) => {
  const border = entry?.error
    ? 'border-rose-400 bg-rose-50'
    : entry?.newPrice !== undefined
      ? 'border-amber-400 bg-amber-50'
      : 'border-slate-300 bg-white';

  // Only inputs from the visible layout (desktop table or mobile cards) are focusable.
  const focusRow = (i: number) => {
    const all = Array.from(document.querySelectorAll<HTMLInputElement>('input[data-price-row]')).filter(
      (el) => el.offsetParent !== null
    );
    all.find((el) => Number(el.dataset.priceRow) === i)?.focus();
  };

  return (
    <div className={block ? 'w-full' : ''}>
      <div className="relative">
        {block && (
          <span aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            Rs.
          </span>
        )}
        <input
          data-price-row={index}
          inputMode="decimal"
          enterKeyHint="next"
          autoComplete="off"
          aria-label={`New LKR price for ${row.name} ${row.sku}`}
          aria-invalid={!!entry?.error}
          value={value ?? ''}
          placeholder={row.priceLKR.toLocaleString()}
          onChange={(e) => onChange(row.key, e.target.value)}
          onFocus={(e) => {
            // Keep the focused field clear of the on-screen keyboard and the fixed action dock.
            if (window.matchMedia('(max-width: 1023px)').matches) {
              e.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
              e.preventDefault();
              focusRow(index + 1);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              focusRow(index - 1);
            }
          }}
          className={`rounded-md border font-mono tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-[#E11D48]/40 ${border} ${
            block ? 'w-full h-12 pl-10 pr-3 text-base' : 'w-32 px-2 py-1.5 text-xs'
          }`}
        />
      </div>
      {entry?.error && <div role="alert" className="mt-0.5 text-[11px] font-semibold text-rose-600">{entry.error}</div>}
    </div>
  );
};
