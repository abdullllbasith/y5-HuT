import React, { useState } from 'react';
import { BULK_MODE_LABELS, BulkMode, isPercentMode, parseBulkValue } from '../../../lib/bulkPricing';

interface Props {
  selectedCount: number;
  hiddenCount: number;
  onClear: () => void;
  onPreview: (mode: BulkMode, value: number) => void;
}

/**
 * Applies to the explicitly selected variants only. Fixed on mobile so it stays reachable,
 * inline-sticky on larger screens.
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
      className="fixed bottom-0 inset-x-0 z-30 md:static md:z-auto rounded-t-xl md:rounded-xl border border-[#E11D48]/40 bg-white p-3 shadow-lg md:shadow-xs space-y-2"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-black text-[#E11D48]">Selected variants: {selectedCount}</span>
        {hiddenCount > 0 && (
          <span className="text-amber-700">{hiddenCount} selected but hidden by filters</span>
        )}
        <button type="button" onClick={onClear} className="font-bold text-slate-600 hover:text-[#E11D48] cursor-pointer">
          Clear selection
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          aria-label="Bulk action"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as BulkMode);
            setError(null);
          }}
          className="px-2 py-2 rounded-lg border border-slate-200 text-xs bg-white"
        >
          {(Object.keys(BULK_MODE_LABELS) as BulkMode[]).map((m) => (
            <option key={m} value={m}>{BULK_MODE_LABELS[m]}</option>
          ))}
        </select>
        <div className="flex-1">
          <input
            inputMode="decimal"
            aria-label={isPercentMode(mode) ? 'Percentage' : 'Amount in LKR'}
            aria-invalid={!!error}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={isPercentMode(mode) ? 'e.g. 3' : mode === 'set' ? 'New price, e.g. 245000' : 'e.g. 2000'}
            className={`w-full px-3 py-2 rounded-lg border text-xs font-mono ${error ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
          />
          {error && <div role="alert" className="mt-0.5 text-[10px] font-semibold text-rose-600">{error}</div>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-[#E11D48] cursor-pointer"
        >
          Preview changes
        </button>
      </div>
      <p className="text-[10px] text-slate-400">
        Applies only to the {selectedCount} selected variant{selectedCount === 1 ? '' : 's'}. Results are rounded to whole rupees.
        Nothing is published until you review and confirm.
      </p>
    </form>
  );
};
