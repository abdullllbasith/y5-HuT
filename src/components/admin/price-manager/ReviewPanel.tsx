import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X, CheckCircle, ArrowRight } from 'lucide-react';
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

  const affectedModelsCount = new Set(changes.map((c) => c.row.productId)).size;

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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-[24px] sm:rounded-[20px] shadow-floating max-w-2xl w-full max-h-[92vh] flex flex-col border border-[#E5E7EB] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E5E7EB] bg-white">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E11D48]">
              Publish Staged Pricing
            </div>
            <h3 id="review-title" className="text-base sm:text-lg font-bold text-[#111827] font-sans mt-0.5">
              Review {changes.length} price change{changes.length === 1 ? '' : 's'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left">
          
          {/* Explicit Scope Summary Callout */}
          <div className="p-3.5 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#111827] block">
                Scope Summary: Updating {changes.length} price{changes.length === 1 ? '' : 's'} across {affectedModelsCount} device model{affectedModelsCount === 1 ? '' : 's'}.
              </span>
              <span className="text-[#6B7280] text-[11px] block mt-0.5">
                Target: Storefront live catalogue, product detail pages, and active shopping bags.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB] text-slate-600 shrink-0">
              Immediate Sync
            </span>
          </div>

          {/* Invalid Rows Alert */}
          {invalid.length > 0 && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 space-y-1">
              <strong className="font-bold block">
                {invalid.length} row{invalid.length === 1 ? ' has' : 's have'} an invalid price format.
              </strong>
              <p className="text-[11px] text-rose-700">
                You must correct or clear these entries before publishing changes to the store:
              </p>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 font-mono text-[11px]">
                {invalid.map((e) => (
                  <li key={e.row.key} className="break-words">
                    {e.row.sku}: &ldquo;{e.raw}&rdquo; — {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Before / After Price Changes List */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 block">
              Staged Modifications
            </span>
            <ul className="divide-y divide-slate-100 border border-[#E5E7EB] rounded-xl max-h-64 overflow-y-auto bg-white">
              {changes.map((e) => (
                <li key={e.row.key} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#111827] truncate">{e.row.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 uppercase">{e.row.brand}</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {[e.row.storage, e.row.color].filter(Boolean).join(' · ')} <span className="font-mono">({e.row.sku})</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 font-mono tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-400 line-through">{formatLKR(e.row.priceLKR)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <strong className="text-[#111827] font-bold">{formatLKR(e.newPrice!)}</strong>
                    </span>
                    <span className={`text-[11px] font-semibold ${e.large ? 'text-[#DC2626]' : 'text-slate-500'}`}>
                      {formatPercent(e.pct!)}
                      {e.large && ' · Large change'}
                    </span>
                  </div>
                </li>
              ))}
              {changes.length === 0 && (
                <li className="p-4 text-xs text-slate-500 text-center">No valid price edits currently staged.</li>
              )}
            </ul>
          </div>

          {/* Large Changes Warning Acknowledgment */}
          {largeCount > 0 && (
            <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 cursor-pointer">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 align-middle accent-[#E11D48] cursor-pointer"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                />
                <strong>{largeCount} change{largeCount === 1 ? ' is' : 's are'} {LARGE_CHANGE_PERCENT}% or greater.</strong> I have verified the pricing accuracy and confirm this publication.
              </span>
            </label>
          )}

          <p className="text-[11px] text-[#6B7280]">
            Demo Environment: Publishing modifies the catalog state in <strong>this browser session</strong>. A 10-second undo toast will appear upon completion.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-5 sm:px-6 py-4 border-t border-[#E5E7EB] bg-[#F7F8FA] pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            ref={backRef}
            onClick={onClose}
            className="h-11 sm:h-auto px-4 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Back to editing
          </button>
          <button
            onClick={handlePublish}
            disabled={blocked}
            className="h-11 sm:h-auto px-5 sm:py-2.5 text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-colors"
          >
            Publish {changes.length} price change{changes.length === 1 ? '' : 's'} to Store
          </button>
        </div>
      </div>
    </div>
  );
};
