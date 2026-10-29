import React from 'react';
import { DraftEntry } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';

interface PriceInputProps {
  row: PriceRow;
  index: number;
  value: string | undefined;
  entry?: DraftEntry;
  onChange: (key: string, raw: string) => void;
}

/** Click, type an LKR amount, Enter jumps to the next row. Nothing is published here. */
export const PriceInput: React.FC<PriceInputProps> = ({ row, index, value, entry, onChange }) => {
  const border = entry?.error
    ? 'border-rose-400 bg-rose-50'
    : entry?.newPrice !== undefined
      ? 'border-amber-400 bg-amber-50'
      : 'border-slate-200 bg-white';

  // Only inputs from the visible layout (desktop table or mobile cards) are focusable.
  const focusRow = (i: number) => {
    const all = Array.from(document.querySelectorAll<HTMLInputElement>('input[data-price-row]')).filter(
      (el) => el.offsetParent !== null
    );
    all.find((el) => Number(el.dataset.priceRow) === i)?.focus();
  };

  return (
    <div>
      <input
        data-price-row={index}
        inputMode="decimal"
        aria-label={`New LKR price for ${row.name} ${row.sku}`}
        aria-invalid={!!entry?.error}
        value={value ?? ''}
        placeholder={row.priceLKR.toLocaleString()}
        onChange={(e) => onChange(row.key, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            focusRow(index + 1);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusRow(index - 1);
          }
        }}
        className={`w-32 px-2 py-1.5 rounded-md border text-xs font-mono tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-[#E11D48]/40 ${border}`}
      />
      {entry?.error && <div className="mt-0.5 text-[10px] font-semibold text-rose-600">{entry.error}</div>}
    </div>
  );
};
