import React, { useState } from 'react';
import { BULK_MODE_LABELS, BulkMode, isPercentMode, parseBulkValue } from '../../../lib/bulkPricing';
import { Button } from '../../ui/Button';

interface Props {
  selectedCount: number;
  hiddenCount: number;
  onClear: () => void;
  onPreview: (mode: BulkMode, value: number) => void;
}

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

  const applyQuickPreset = (presetMode: BulkMode, presetVal: string) => {
    setMode(presetMode);
    setRaw(presetVal);
    const parsed = parseBulkValue(presetMode, presetVal);
    if (parsed.ok) {
      setError(null);
      onPreview(presetMode, parsed.value);
    }
  };

  return (
    <form
      onSubmit={submit}
      aria-label="Bulk price actions"
      className="rounded-2xl border border-line bg-card p-4 shadow-hard space-y-3 text-left font-ui"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-data font-bold text-red">Selected: {selectedCount} variant tags</span>
        <button
          type="button"
          onClick={onClear}
          className="min-h-[36px] px-2 font-data font-bold text-ink-soft hover:text-ink cursor-pointer"
        >
          Clear selection
        </button>
      </div>

      {hiddenCount > 0 && (
        <div className="font-data text-[11px] text-low">
          {hiddenCount} selected tags hidden by current filter
        </div>
      )}

      {/* Quick math preset buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="font-data text-[10px] text-ink-soft uppercase font-bold shrink-0 mr-1">
          Quick Math:
        </span>
        <button
          type="button"
          onClick={() => applyQuickPreset('decrease-amount', '1000')}
          className="font-data text-[10px] font-bold px-2 py-1 rounded bg-paper-sunk border border-line text-ink hover:border-ink cursor-pointer shrink-0"
        >
          -Rs. 1,000
        </button>
        <button
          type="button"
          onClick={() => applyQuickPreset('decrease-amount', '2000')}
          className="font-data text-[10px] font-bold px-2 py-1 rounded bg-paper-sunk border border-line text-ink hover:border-ink cursor-pointer shrink-0"
        >
          -Rs. 2,000
        </button>
        <button
          type="button"
          onClick={() => applyQuickPreset('decrease-percent', '5')}
          className="font-data text-[10px] font-bold px-2 py-1 rounded bg-highlighter/40 border border-line text-ink hover:border-ink cursor-pointer shrink-0"
        >
          -5% Drop
        </button>
        <button
          type="button"
          onClick={() => applyQuickPreset('increase-percent', '3')}
          className="font-data text-[10px] font-bold px-2 py-1 rounded bg-paper-sunk border border-line text-ink hover:border-ink cursor-pointer shrink-0"
        >
          +3% Hike
        </button>
      </div>

      <div className="grid grid-cols-2 md:flex gap-2 items-center">
        <select
          aria-label="Bulk action"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as BulkMode);
            setError(null);
          }}
          className="col-span-2 md:col-span-1 h-11 md:h-10 px-3 rounded-xl border border-line text-xs font-semibold bg-paper text-ink cursor-pointer"
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
            placeholder={isPercentMode(mode) ? 'e.g. 5%' : mode === 'set' ? 'e.g. 245000' : 'e.g. 2000'}
            className={`w-full h-11 md:h-10 px-3.5 rounded-xl border font-data text-xs bg-paper text-ink focus:outline-none focus:border-ink ${
              error ? 'border-red bg-red-wash' : 'border-line'
            }`}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="h-11 md:h-10"
        >
          Preview Changes
        </Button>
      </div>
      {error && <div role="alert" className="text-[11px] font-bold font-data text-red">{error}</div>}
      <p className="hidden md:block font-data text-[10px] text-ink-soft">
        Applies only to the {selectedCount} selected variant{selectedCount === 1 ? '' : 's'}. Results are rounded to whole rupees.
        Nothing is published until you review and confirm.
      </p>
    </form>
  );
};
