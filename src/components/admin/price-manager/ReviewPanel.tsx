import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { PriceDraft } from './usePriceDraft';
import { formatLKR, formatPercent, LARGE_CHANGE_PERCENT } from '../../../lib/priceValidation';
import { Dot } from '../../ui/Dot';
import { Button } from '../../ui/Button';

interface Props {
  draft: PriceDraft;
  onClose: () => void;
  onPublished: (applied: number) => void;
}

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-paper rounded-t-3xl sm:rounded-3xl shadow-hard max-w-2xl w-full max-h-[92vh] flex flex-col border border-line overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-line bg-card">
          <div>
            <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
              <Dot tone="red" size="xs" />
              <span>Publish Counter Tags</span>
            </div>
            <h3 id="review-title" className="font-display text-lg sm:text-xl font-bold text-ink mt-0.5">
              Review {changes.length} price change{changes.length === 1 ? '' : 's'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-paper flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk cursor-pointer transition-colors min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-ui">
          
          {/* Explicit Scope Summary Callout */}
          <div className="p-4 bg-card rounded-2xl border border-line flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-ink block">
                Scope Summary: Updating {changes.length} price{changes.length === 1 ? '' : 's'} across {affectedModelsCount} device model{affectedModelsCount === 1 ? '' : 's'}.
              </span>
              <span className="text-ink-soft text-[11px] block mt-0.5">
                Target: Storefront live catalogue, product detail pages, and active shopping bags.
              </span>
            </div>
            <span className="font-data text-[10px] font-bold bg-paper-sunk px-2.5 py-1 rounded-full border border-line text-ink shrink-0">
              Immediate Sync
            </span>
          </div>

          {/* Invalid Rows Alert */}
          {invalid.length > 0 && (
            <div role="alert" className="rounded-2xl border border-red/30 bg-red-wash p-4 text-xs text-red space-y-1">
              <strong className="font-bold block">
                {invalid.length} row{invalid.length === 1 ? ' has' : 's have'} an invalid price format.
              </strong>
              <p className="text-[11px] text-red-ink">
                You must correct or clear these entries before publishing changes to the store:
              </p>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 font-data text-[11px]">
                {invalid.map((e) => (
                  <li key={e.row.key} className="break-words">
                    {e.row.sku}: &ldquo;{e.raw}&rdquo; — {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Before / After Price Changes List: 2-column before/after, red strikethrough -> ink new */}
          <div className="space-y-2">
            <span className="font-data text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Staged Tag Modifications
            </span>
            <ul className="divide-y divide-line border border-line rounded-2xl max-h-64 overflow-y-auto bg-card">
              {changes.map((e) => (
                <li key={e.row.key} className="p-3.5 text-xs hover:bg-paper-sunk/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink truncate">{e.row.name}</span>
                    <span className="font-data text-[10px] text-ink-soft shrink-0 uppercase">{e.row.brand}</span>
                  </div>
                  <div className="font-data text-[11px] text-ink-soft">
                    {[e.row.storage, e.row.color].filter(Boolean).join(' · ')} <span className="font-data">({e.row.sku})</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 font-data tabular-nums">
                    <span className="flex items-center gap-2">
                      <span className="text-red line-through font-medium">{formatLKR(e.row.priceLKR)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-soft" />
                      <strong className="text-ink font-bold text-sm">{formatLKR(e.newPrice!)}</strong>
                    </span>
                    <span className={`text-[11px] font-bold ${e.large ? 'text-red bg-red-wash px-1.5 py-0.2 rounded' : 'text-ink-soft'}`}>
                      {formatPercent(e.pct!)}
                      {e.large && ' · Large change'}
                    </span>
                  </div>
                </li>
              ))}
              {changes.length === 0 && (
                <li className="p-4 text-xs text-ink-soft text-center font-data">No valid price edits currently staged.</li>
              )}
            </ul>
          </div>

          {/* Large Changes Warning Acknowledgment */}
          {largeCount > 0 && (
            <label className="flex items-start gap-3 rounded-2xl border border-line bg-highlighter/30 p-4 text-xs text-ink cursor-pointer">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red" />
              <span>
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 align-middle accent-red cursor-pointer"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                />
                <strong>{largeCount} change{largeCount === 1 ? ' is' : 's are'} {LARGE_CHANGE_PERCENT}% or greater.</strong> I have verified the pricing accuracy and confirm this publication.
              </span>
            </label>
          )}

          <p className="font-data text-[11px] text-ink-soft">
            Demo Environment: Publishing modifies the catalog state in <strong>this browser session</strong>. A 10-second undo toast will appear upon completion.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-5 sm:px-6 py-4 border-t border-line bg-card pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            ref={backRef}
            variant="ghost"
            onClick={onClose}
          >
            Back to editing
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={blocked}
          >
            Publish {changes.length} price change{changes.length === 1 ? '' : 's'} to Store
          </Button>
        </div>
      </div>
    </div>
  );
};
