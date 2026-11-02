import React from 'react';
import { DraftEntry } from './usePriceDraft';
import { PriceRow } from '../../../lib/priceRows';

interface PriceInputProps {
  row: PriceRow;
  index: number;
  value: string | undefined;
  entry?: DraftEntry;
  onChange: (key: string, raw: string) => void;
  block?: boolean;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  row,
  index,
  value,
  entry,
  onChange,
  block,
}) => {
  const border = entry?.error
    ? 'border-red bg-red-wash text-red'
    : entry?.newPrice !== undefined
    ? 'border-ink bg-highlighter/40 text-ink shadow-hard-sm'
    : 'border-line bg-paper text-ink';

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
          <span aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-soft">
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
          className={`rounded-xl border font-data tabular-nums text-right focus:outline-none focus:border-ink ${border} ${
            block ? 'w-full h-12 pl-10 pr-3 text-base' : 'w-32 px-2.5 py-1.5 text-xs'
          }`}
        />
      </div>
      {entry?.error && (
        <div role="alert" className="mt-0.5 text-[10px] font-bold text-red font-data">
          {entry.error}
        </div>
      )}
    </div>
  );
};
