import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BULK_MODE_LABELS, BulkMode, BulkPreview } from '../../../lib/bulkPricing';
import { formatLKR, formatPercent } from '../../../lib/priceValidation';
import { Button } from '../../ui/Button';

interface Props {
  mode: BulkMode;
  value: number;
  preview: BulkPreview;
  onCancel: () => void;
  onStage: () => void;
}

const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '');

export const BulkPreviewDialog: React.FC<Props> = ({ mode, value, preview, onCancel, onStage }) => {
  const { rows, changes, unchanged, invalid, warnings } = preview;
  const [ack, setAck] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const needsAck = warnings.length > 0;
  const blocked = changes.length === 0 || (needsAck && !ack);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/70 backdrop-blur-xs text-left font-ui">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-preview-title"
        className="bg-paper rounded-t-3xl sm:rounded-3xl shadow-hard max-w-3xl w-full max-h-[92vh] flex flex-col border border-line"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-card">
          <div>
            <h3 id="bulk-preview-title" className="font-display text-lg font-bold text-ink">
              Bulk Change Preview
            </h3>
            <p className="font-data text-xs text-ink-soft">
              {BULK_MODE_LABELS[mode]}: <strong className="text-ink">{value}</strong> · applied to {rows.length} selected variant{rows.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close preview"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-go/10 text-go border border-go/20 p-2.5">
              <strong className="block font-data text-xl font-bold">{changes.length}</strong>
              <span className="font-ui font-semibold">Will Change</span>
            </div>
            <div className="rounded-xl bg-paper-sunk text-ink-soft border border-line p-2.5">
              <strong className="block font-data text-xl font-bold text-ink">{unchanged.length}</strong>
              <span className="font-ui font-semibold">Unchanged (Skip)</span>
            </div>
            <div className={`rounded-xl p-2.5 border ${invalid.length ? 'bg-red-wash text-red border-red/30' : 'bg-paper-sunk text-ink-soft border-line'}`}>
              <strong className="block font-data text-xl font-bold">{invalid.length}</strong>
              <span className="font-ui font-semibold">Invalid (Skip)</span>
            </div>
          </div>

          <p className="font-data text-[11px] text-ink-soft">
            Rounding rule: Every calculated price is rounded to whole rupees. Unchanged and invalid rows are never staged.
          </p>

          <div className="border border-line rounded-2xl overflow-x-auto bg-card">
            <table className="w-full text-xs">
              <thead className="bg-paper-sunk text-ink-soft uppercase font-data text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-3 py-2 text-left">Variant Tag</th>
                  <th className="px-3 py-2 text-right">Current</th>
                  <th className="px-3 py-2 text-right">Staged After</th>
                  <th className="px-3 py-2 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr
                    key={r.row.key}
                    className={
                      r.status === 'invalid'
                        ? 'bg-red-wash/40 text-red'
                        : r.status === 'unchanged'
                        ? 'text-ink-soft/60'
                        : 'hover:bg-paper-sunk/40'
                    }
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-ink">{r.row.name}</div>
                      <div className="font-data text-[10px] text-ink-soft">
                        {[r.row.storage, r.row.color].filter(Boolean).join(' · ')} <span className="font-data">({r.row.sku})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-data tabular-nums">{formatLKR(r.row.priceLKR)}</td>
                    {r.status === 'invalid' ? (
                      <td colSpan={2} className="px-3 py-2.5 text-right text-red font-bold font-data">{r.reason} — skipped</td>
                    ) : (
                      <>
                        <td className="px-3 py-2.5 text-right font-data tabular-nums font-bold text-ink">{formatLKR(r.newPrice!)}</td>
                        <td className={`px-3 py-2.5 text-right font-data tabular-nums ${r.large ? 'text-red font-bold' : ''}`}>
                          {r.status === 'unchanged' ? 'No change' : `${sign(r.diff!)}${formatLKR(Math.abs(r.diff!))} (${formatPercent(r.pct!)})`}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {warnings.length > 0 && (
            <div className="rounded-2xl border border-line bg-highlighter/30 p-3.5 text-xs text-ink space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold"><AlertTriangle className="w-4 h-4 text-red" /> Please verify before staging</div>
              <ul className="list-disc pl-5 font-data text-xs">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
              <label className="flex items-center gap-2 pt-1 cursor-pointer font-bold">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="accent-red cursor-pointer" />
                I understand and want to stage these changes into draft.
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-5 py-4 border-t border-line bg-card">
          <Button
            ref={cancelRef}
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onStage}
            disabled={blocked}
          >
            Stage {changes.length} change{changes.length === 1 ? '' : 's'} as draft
          </Button>
        </div>
      </div>
    </div>
  );
};
