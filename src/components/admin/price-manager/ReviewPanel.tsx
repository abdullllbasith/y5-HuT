import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { PriceDraft } from './usePriceDraft';
import { formatLKR, formatPercent, LARGE_CHANGE_PERCENT } from '../../../lib/priceValidation';

interface Props {
  draft: PriceDraft;
  onClose: () => void;
  onPublished: (applied: number) => void;
}

/** Final confirmation. A bottom sheet on phones, a centered dialog on larger screens. */
export const ReviewPanel: React.FC<Props> = ({ draft, onClose, onPublished }) => {
  const { changes, invalid } = draft;
  const largeCount = changes.filter((c) => c.large).length;
  const [ack, setAck] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const blocked = invalid.length > 0 || changes.length === 0 || (largeCount > 0 && !ack);

  useEffect(() => {
    backRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handlePublish = () => {
    if (blocked) return;
    const { applied } = draft.publish();
    onPublished(applied);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/50 backdrop-blur-xs" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200"
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200">
          <h3 id="review-title" className="text-base font-bold text-slate-900">
            Review {changes.length} price change{changes.length === 1 ? '' : 's'}
          </h3>
          <button onClick={onClose} aria-label="Close" className="w-11 h-11 -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {invalid.length > 0 && (
            <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
              <strong>{invalid.length} row{invalid.length === 1 ? ' has' : 's have'} an invalid price.</strong> Go back and fix or
              clear {invalid.length === 1 ? 'it' : 'them'}:
              <ul className="mt-1 list-disc pl-4">
                {invalid.map((e) => (
                  <li key={e.row.key} className="break-words">{e.row.sku}: “{e.raw}” — {e.error}</li>
                ))}
              </ul>
            </div>
          )}

          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {changes.map((e) => (
              <li key={e.row.key} className="px-3 py-2.5 text-xs">
                <div className="font-bold text-slate-900 break-words">{e.row.name}</div>
                <div className="text-[11px] text-slate-500 break-words">
                  {[e.row.storage, e.row.color].filter(Boolean).join(' · ')} <span className="font-mono">{e.row.sku}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 font-mono tabular-nums">
                  <span>
                    <span className="text-slate-500">{formatLKR(e.row.priceLKR)}</span> → <strong className="text-slate-900">{formatLKR(e.newPrice!)}</strong>
                  </span>
                  <span className={e.large ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                    {formatPercent(e.pct!)}
                    {e.large && ' · large'}
                  </span>
                </div>
              </li>
            ))}
            {changes.length === 0 && <li className="px-3 py-4 text-xs text-slate-500">No valid changes to publish.</li>}
          </ul>

          {largeCount > 0 && (
            <label className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 cursor-pointer">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <input type="checkbox" className="mr-2 w-4 h-4 align-middle accent-[#E11D48]" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                {largeCount} change{largeCount === 1 ? ' is' : 's are'} {LARGE_CHANGE_PERCENT}% or more. I have checked
                {largeCount === 1 ? ' it' : ' them'} and want to publish.
              </span>
            </label>
          )}

          <p className="text-[11px] text-slate-500">
            Demo only: publishing updates the storefront in <strong>this browser</strong>. You can undo the last publish. Past sample
            orders keep their totals. USD display prices are illustrative and are not changed.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-slate-200 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button ref={backRef} onClick={onClose} className="h-11 sm:h-auto px-4 sm:py-2 text-sm sm:text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Back to editing
          </button>
          <button
            onClick={handlePublish}
            disabled={blocked}
            className="h-12 sm:h-auto px-5 sm:py-2 text-sm sm:text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Publish {changes.length} Change{changes.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
};
