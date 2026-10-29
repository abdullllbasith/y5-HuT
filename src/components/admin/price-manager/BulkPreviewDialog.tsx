import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BULK_MODE_LABELS, BulkMode, BulkPreview } from '../../../lib/bulkPricing';
import { formatLKR, formatPercent } from '../../../lib/priceValidation';

interface Props {
  mode: BulkMode;
  value: number;
  preview: BulkPreview;
  onCancel: () => void;
  onStage: () => void;
}

const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '');

/** Shows exactly what a bulk action would do. Confirming only stages drafts; it does not publish. */
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-preview-title"
        className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 id="bulk-preview-title" className="text-base font-bold text-slate-900">Bulk change preview</h3>
            <p className="text-xs text-slate-500">
              {BULK_MODE_LABELS[mode]}: <strong className="font-mono">{value}</strong> · applied to {rows.length} selected variant
              {rows.length === 1 ? '' : 's'}
            </p>
          </div>
          <button onClick={onCancel} aria-label="Close preview" className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-emerald-50 text-emerald-800 p-2"><strong className="block text-lg">{changes.length}</strong>will change</div>
            <div className="rounded-lg bg-slate-100 text-slate-700 p-2"><strong className="block text-lg">{unchanged.length}</strong>unchanged (skipped)</div>
            <div className={`rounded-lg p-2 ${invalid.length ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
              <strong className="block text-lg">{invalid.length}</strong>invalid (skipped)
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Rounding: every new price is rounded to a whole rupee. Unchanged and invalid rows are never staged.
          </p>

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <caption className="sr-only">Before and after prices</caption>
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2 text-left">Variant</th>
                  <th className="px-3 py-2 text-right">Before</th>
                  <th className="px-3 py-2 text-right">After</th>
                  <th className="px-3 py-2 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.row.key} className={r.status === 'invalid' ? 'bg-rose-50/60' : r.status === 'unchanged' ? 'text-slate-400' : ''}>
                    <td className="px-3 py-2">
                      <div className="font-bold">{r.row.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {[r.row.storage, r.row.color].filter(Boolean).join(' · ')} <span className="font-mono">{r.row.sku}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{formatLKR(r.row.priceLKR)}</td>
                    {r.status === 'invalid' ? (
                      <td colSpan={2} className="px-3 py-2 text-right text-rose-700 font-semibold">{r.reason} — skipped</td>
                    ) : (
                      <>
                        <td className="px-3 py-2 text-right font-mono tabular-nums font-bold">{formatLKR(r.newPrice!)}</td>
                        <td className={`px-3 py-2 text-right font-mono tabular-nums ${r.large ? 'text-rose-600 font-bold' : ''}`}>
                          {r.status === 'unchanged' ? 'no change' : `${sign(r.diff!)}${formatLKR(Math.abs(r.diff!))} (${formatPercent(r.pct!)})`}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {warnings.length > 0 && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold"><AlertTriangle className="w-4 h-4" /> Please check before staging</div>
              <ul className="list-disc pl-5">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                I understand and want to stage these changes.
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button ref={cancelRef} onClick={onCancel} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onStage}
            disabled={blocked}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Stage {changes.length} change{changes.length === 1 ? '' : 's'} as draft
          </button>
        </div>
      </div>
    </div>
  );
};
