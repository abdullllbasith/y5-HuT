import React, { useState } from 'react';
import { BULK_MODE_LABELS, BulkMode, isPercentMode, parseBulkValue } from '../../../lib/bulkPricing';

interface Props {
  selectedCount: number;
  hiddenCount: number;
  onClear: () => void;
  onPreview: (mode: BulkMode, value: number) => void;
}

/**
 * Applies to the explicitly selected variants only. It lives in the page's action dock, which stacks
 * it with the draft bar above the bottom navigation on phones, so nothing overlaps.
 */
export const BulkToolbar: React.FC<Props> = ({ selectedCount, hiddenCount, onClear, onPreview }) => {
  const [mode, setMode] = useState<BulkMode>('decrease-amount');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (selectedCount === 0) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseBulkValue(mode, raw);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    onPreview(mode, parsed.value);
  };

  return (
    <form
      onSubmit={submit}
      aria-label="Bulk price actions"
      className="rounded-xl border border-[#E11D48]/40 bg-white p-3 shadow-lg md:shadow-xs space-y-2"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-black text-[#E11D48]">Selected variants: {selectedCount}</span>
        <button type="button" onClick={onClear} className="min-h-9 px-2 font-bold text-slate-600 hover:text-[#E11D48] cursor-pointer">
          Clear selection
        </button>
      </div>
      {hiddenCount > 0 && <div className="text-[11px] text-amber-700">{hiddenCount} selected but hidden by filters</div>}

      <div className="grid grid-cols-2 md:flex gap-2">
        <select
          aria-label="Bulk action"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as BulkMode);
            setError(null);
          }}
          className="col-span-2 md:col-span-1 h-11 md:h-auto px-2 py-2 rounded-lg border border-slate-300 text-sm md:text-xs bg-white"
        >
          {(Object.keys(BULK_MODE_LABELS) as BulkMode[]).map((m) => (
            <option key={m} value={m}>{BULK_MODE_LABELS[m]}</option>
          ))}
        </select>
        <div className="md:flex-1 min-w-0">
          <input
            inputMode="decimal"
            enterKeyHint="go"
            autoComplete="off"
            aria-label={isPercentMode(mode) ? 'Percentage' : 'Amount in LKR'}
            aria-invalid={!!error}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={isPercentMode(mode) ? 'e.g. 3' : mode === 'set' ? 'e.g. 245000' : 'e.g. 2000'}
            className={`w-full h-11 md:h-auto px-3 py-2 rounded-lg border text-base md:text-xs font-mono ${error ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
          />
        </div>
        <button
          type="submit"
          className="h-11 md:h-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-sm md:text-xs font-bold hover:bg-[#E11D48] cursor-pointer"
        >
          Preview changes
        </button>
      </div>
      {error && <div role="alert" className="text-[11px] font-semibold text-rose-600">{error}</div>}
      <p className="hidden md:block text-[10px] text-slate-400">
        Applies only to the {selectedCount} selected variant{selectedCount === 1 ? '' : 's'}. Results are rounded to whole rupees.
        Nothing is published until you review and confirm.
      </p>
    </form>
  );
};
