import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { PriceDraft } from './usePriceDraft';
import { formatLKR, formatPercent, LARGE_CHANGE_PERCENT } from '../../../lib/priceValidation';

interface Props {
  draft: PriceDraft;
  onClose: () => void;
  onPublished: (applied: number) => void;
}

export const ReviewPanel: React.FC<Props> = ({ draft, onClose, onPublished }) => {
  const { changes, invalid } = draft;
  const largeCount = changes.filter((c) => c.large).length;
  const [ack, setAck] = useState(false);
  const blocked = invalid.length > 0 || changes.length === 0 || (largeCount > 0 && !ack);

  const handlePublish = () => {
    if (blocked) return;
    const { applied } = draft.publish();
    onPublished(applied);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-label="Review price changes"
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Review {changes.length} price change{changes.length === 1 ? '' : 's'}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {invalid.length > 0 && (
            <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
              <strong>{invalid.length} row{invalid.length === 1 ? ' has' : 's have'} an invalid price.</strong> Fix or
              clear {invalid.length === 1 ? 'it' : 'them'} before publishing:
              <ul className="mt-1 list-disc pl-4">
                {invalid.map((e) => (
                  <li key={e.row.key}>{e.row.sku}: “{e.raw}” — {e.error}</li>
                ))}
              </ul>
            </div>
          )}

          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {changes.map((e) => (
              <li key={e.row.key} className="px-3 py-2 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{e.row.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {[e.row.storage, e.row.color].filter(Boolean).join(' · ')} <span className="font-mono">{e.row.sku}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono tabular-nums">
                  <span className="text-slate-500">{formatLKR(e.row.priceLKR)}</span> →{' '}
                  <strong className="text-slate-900">{formatLKR(e.newPrice!)}</strong>
                  <div className={e.large ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                    {formatPercent(e.pct!)}
                    {e.large && ' · large'}
                  </div>
                </div>
              </li>
            ))}
            {changes.length === 0 && <li className="px-3 py-4 text-xs text-slate-500">No valid changes to publish.</li>}
          </ul>

          {largeCount > 0 && (
            <label className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 cursor-pointer">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <input type="checkbox" className="mr-2" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                {largeCount} change{largeCount === 1 ? ' is' : 's are'} {LARGE_CHANGE_PERCENT}% or more. I have checked
                {largeCount === 1 ? ' it' : ' them'} and want to publish.
              </span>
            </label>
          )}

          <p className="text-[11px] text-slate-500">
            Demo only: publishing updates the storefront in <strong>this browser</strong>. Past sample orders keep their
            original totals. USD display prices are illustrative and are not changed.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Back to editing
          </button>
          <button
            onClick={handlePublish}
            disabled={blocked}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Publish {changes.length} Change{changes.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
};
